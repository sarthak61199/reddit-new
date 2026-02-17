import { createServerFn } from "@tanstack/react-start";
import {
  createPostSchema,
  deletePostSchema,
  getPostSchema,
  getPostsSchema,
  updatePostSchema,
  votePostSchema,
} from "@/validations/post";
import { authMiddleware } from "@/middleware/auth";
import { prisma } from "@/lib/db";

export const getPosts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator(getPostsSchema)
  .handler(async ({ context: { user }, data: { subredditId } }) => {
    const posts = await prisma.post.findMany({
      where: subredditId
        ? { subredditId }
        : {
            subreddit: {
              members: {
                some: {
                  userId: user.id,
                },
              },
            },
          },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        subreddit: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
        votes: {
          select: {
            type: true,
            userId: true,
          },
        },
      },
    });

    const postsWithVoteCount = posts.map((post) => {
      const userVote =
        post.votes.find((v) => v.userId === user.id)?.type || null;
      const voteCount = post.votes.reduce((acc, vote) => {
        return acc + (vote.type === "UP" ? 1 : -1);
      }, 0);

      const { votes, _count, ...postWithoutVotes } = post;

      return {
        ...postWithoutVotes,
        commentCount: _count.comments,
        userVote,
        voteCount,
      };
    });

    return postsWithVoteCount;
  });

export const getPost = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator(getPostSchema)
  .handler(async ({ context: { user }, data: { id } }) => {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        subreddit: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
        votes: {
          select: {
            type: true,
            userId: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const userVote = post.votes.find((v) => v.userId === user.id)?.type || null;
    const voteCount = post.votes.reduce((acc, vote) => {
      return acc + (vote.type === "UP" ? 1 : -1);
    }, 0);

    const { votes, _count, ...postWithoutVotes } = post;

    return {
      ...postWithoutVotes,
      userVote,
      commentCount: _count.comments,
      voteCount,
    };
  });

export const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(createPostSchema)
  .handler(
    async ({ context: { user }, data: { title, content, subredditId } }) => {
      const subreddit = await prisma.subreddit.findUnique({
        where: {
          id: subredditId,
        },
      });

      if (!subreddit) {
        throw new Error("Subreddit not found");
      }

      const post = await prisma.post.create({
        data: {
          title,
          content,
          subredditId,
          creatorId: user.id,
          votes: {
            create: {
              type: "UP",
              userId: user.id,
            },
          },
        },
      });

      return post;
    },
  );

export const updatePost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(updatePostSchema)
  .handler(async ({ context: { user }, data: { id, title, content } }) => {
    const post = await prisma.post.findUnique({
      where: {
        id,
        creatorId: user.id,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const updatedPost = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        content,
      },
    });

    return updatedPost;
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(deletePostSchema)
  .handler(async ({ context: { user }, data: { id } }) => {
    const post = await prisma.post.findUnique({
      where: {
        id,
        creatorId: user.id,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    await prisma.post.delete({
      where: {
        id,
        creatorId: user.id,
      },
    });

    return { success: true };
  });

export const votePost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(votePostSchema)
  .handler(async ({ context: { user }, data: { postId, type } }) => {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const isVoted = await prisma.postVote.findUnique({
      where: {
        postId_userId: {
          postId: postId,
          userId: user.id,
        },
      },
    });

    if (!isVoted) {
      return await prisma.postVote.create({
        data: {
          postId,
          userId: user.id,
          type,
        },
      });
    }

    if (isVoted.type === type) {
      return await prisma.postVote.delete({
        where: {
          postId_userId: {
            postId: postId,
            userId: user.id,
          },
        },
      });
    } else {
      return await prisma.postVote.update({
        where: {
          postId_userId: {
            postId: postId,
            userId: user.id,
          },
        },
        data: {
          type,
        },
      });
    }
  });

export type Post = Awaited<ReturnType<typeof getPost>>;
