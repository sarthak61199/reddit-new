import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/middleware/auth";
import {
  addSubredditModeratorSchema,
  createSubredditSchema,
  deleteSubredditSchema,
  getSubredditSchema,
  joinUnjoinSubredditSchema,
  removeSubredditModeratorSchema,
  updateSubredditSchema,
} from "@/validations/subreddit";
import { prisma } from "@/lib/db";

export const getSubreddits = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context: { user } }) => {
    const subreddits = await prisma.subreddit.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return subreddits;
  });

export const getSubreddit = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator(getSubredditSchema)
  .handler(async ({ data: { id } }) => {
    const [subreddit, moderators] = await prisma.$transaction([
      prisma.subreddit.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          description: true,
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              members: true,
            },
          },
        },
      }),

      prisma.subredditModerator.findMany({
        where: {
          subredditId: id,
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    if (!subreddit) {
      throw new Error("Subreddit not found");
    }

    return {
      ...subreddit,
      moderators: moderators.map((moderator) => moderator.user),
    };
  });

export const createSubreddit = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(createSubredditSchema)
  .handler(async ({ context: { user }, data: { name, description } }) => {
    const subreddit = await prisma.subreddit.findUnique({
      where: {
        name,
      },
    });

    if (subreddit) {
      throw new Error("Subreddit already exists");
    }

    const createdSubreddit = await prisma.subreddit.create({
      data: {
        name,
        description,
        creatorId: user.id,
        members: {
          create: {
            userId: user.id,
          },
        },
        moderators: {
          create: {
            userId: user.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    return createdSubreddit;
  });

export const updateSubreddit = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(updateSubredditSchema)
  .handler(async ({ context: { user }, data: { id, name, description } }) => {
    const subreddit = await prisma.subreddit.findUnique({
      where: {
        id,
      },
    });

    if (!subreddit) {
      throw new Error("Subreddit not found");
    }

    const isModerator = await prisma.subredditModerator.findUnique({
      where: {
        subredditId_userId: {
          subredditId: id,
          userId: user.id,
        },
      },
    });

    if (!isModerator) {
      throw new Error("You are not a moderator of this subreddit");
    }

    const updatedSubreddit = await prisma.subreddit.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    return updatedSubreddit;
  });

export const deleteSubreddit = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(deleteSubredditSchema)
  .handler(async ({ context: { user }, data: { id } }) => {
    const subreddit = await prisma.subreddit.findUnique({
      where: {
        id,
      },
    });

    if (!subreddit) {
      throw new Error("Subreddit not found");
    }

    const isModerator = await prisma.subredditModerator.findUnique({
      where: {
        subredditId_userId: {
          subredditId: id,
          userId: user.id,
        },
      },
    });

    if (!isModerator) {
      throw new Error("You are not a moderator of this subreddit");
    }

    await prisma.subreddit.delete({
      where: {
        id,
      },
    });

    return { success: true };
  });

export const addSubredditModerator = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(addSubredditModeratorSchema)
  .handler(async ({ context: { user }, data: { subredditId, userId } }) => {
    const subreddit = await prisma.subreddit.findUnique({
      where: {
        id: subredditId,
      },
    });

    if (!subreddit) {
      throw new Error("Subreddit not found");
    }

    const isModerator = await prisma.subredditModerator.findUnique({
      where: {
        subredditId_userId: {
          subredditId: subredditId,
          userId: user.id,
        },
      },
    });

    if (!isModerator) {
      throw new Error("You are not a moderator of this subreddit");
    }

    const isAlreadyModerator = await prisma.subredditModerator.findUnique({
      where: {
        subredditId_userId: {
          subredditId: subredditId,
          userId: userId,
        },
      },
    });

    if (isAlreadyModerator) {
      throw new Error("User is already a moderator of this subreddit");
    }

    const newModerator = await prisma.subredditModerator.create({
      data: {
        subredditId: subredditId,
        userId: userId,
      },
    });

    return newModerator;
  });

export const removeSubredditModerator = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(removeSubredditModeratorSchema)
  .handler(async ({ context: { user }, data: { subredditId, userId } }) => {
    const subreddit = await prisma.subreddit.findUnique({
      where: {
        id: subredditId,
      },
    });

    if (!subreddit) {
      throw new Error("Subreddit not found");
    }

    const isModerator = await prisma.subredditModerator.findUnique({
      where: {
        subredditId_userId: {
          subredditId: subredditId,
          userId: user.id,
        },
      },
    });

    if (!isModerator) {
      throw new Error("You are not a moderator of this subreddit");
    }

    await prisma.subredditModerator.delete({
      where: {
        subredditId_userId: {
          subredditId: subredditId,
          userId: userId,
        },
      },
    });

    return { success: true };
  });

export const joinUnjoinSubreddit = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(joinUnjoinSubredditSchema)
  .handler(async ({ context: { user }, data: { subredditId } }) => {
    const subreddit = await prisma.subreddit.findUnique({
      where: {
        id: subredditId,
      },
    });

    if (!subreddit) {
      throw new Error("Subreddit not found");
    }

    const isMember = await prisma.subredditMember.findUnique({
      where: {
        subredditId_userId: {
          subredditId: subredditId,
          userId: user.id,
        },
      },
    });

    if (isMember) {
      await prisma.subredditMember.delete({
        where: {
          subredditId_userId: {
            subredditId: subredditId,
            userId: user.id,
          },
        },
      });
    } else {
      await prisma.subredditMember.create({
        data: {
          subredditId: subredditId,
          userId: user.id,
        },
      });
    }
  });
