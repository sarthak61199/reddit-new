import { createServerFn } from "@tanstack/react-start";
import type { VoteType } from "@/generated/prisma/enums";
import { authMiddleware } from "@/middleware/auth";
import {
  createCommentSchema,
  deleteCommentSchema,
  getCommentsSchema,
  updateCommentSchema,
  voteCommentSchema,
} from "@/validations/comment";
import { prisma } from "@/lib/db";

export const getComments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator(getCommentsSchema)
  .handler(async ({ context: { user }, data: { postId } }) => {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        parentId: true,
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            votes: true,
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

    type CommentWithVotes = {
      id: string;
      content: string;
      createdAt: Date;
      parentId: string | null;
      creator: {
        id: string;
        name: string;
      };
      userVote: VoteType | null;
      voteCount: number;
      replies: Array<CommentWithVotes>;
    };

    const commentsWithVotes: Array<CommentWithVotes> = comments.map(
      (comment) => {
        const userVote =
          comment.votes.find((v) => v.userId === user.id)?.type || null;
        const voteCount = comment.votes.reduce((acc, vote) => {
          return acc + (vote.type === "UP" ? 1 : -1);
        }, 0);

        const { votes, _count, ...commentWithoutVotes } = comment;
        return {
          ...commentWithoutVotes,
          userVote,
          voteCount,
          replies: [],
        };
      },
    );

    const commentMap = new Map(commentsWithVotes.map((c) => [c.id, c]));
    const rootComments: Array<CommentWithVotes> = [];

    for (const comment of commentsWithVotes) {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    }

    return rootComments;
  });

export const createComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(createCommentSchema)
  .handler(
    async ({ context: { user }, data: { content, postId, parentId } }) => {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          postId,
          creatorId: user.id,
          parentId,
        },
      });

      return comment;
    },
  );

export const updateComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(updateCommentSchema)
  .handler(async ({ context: { user }, data: { id, content } }) => {
    const comment = await prisma.comment.findUnique({
      where: {
        id,
        creatorId: user.id,
      },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    const updatedComment = await prisma.comment.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });

    return updatedComment;
  });

export const deleteComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(deleteCommentSchema)
  .handler(async ({ context: { user }, data: { id } }) => {
    const comment = await prisma.comment.findUnique({
      where: {
        id,
        creatorId: user.id,
      },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    await prisma.comment.delete({
      where: {
        id,
        creatorId: user.id,
      },
    });

    return { success: true };
  });

export const voteComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(voteCommentSchema)
  .handler(async ({ context: { user }, data: { commentId, type } }) => {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    const isVoted = await prisma.commentVote.findUnique({
      where: {
        commentId_userId: {
          commentId: commentId,
          userId: user.id,
        },
      },
    });

    if (!isVoted) {
      return await prisma.commentVote.create({
        data: {
          commentId,
          userId: user.id,
          type,
        },
      });
    }

    if (isVoted.type === type) {
      return await prisma.commentVote.delete({
        where: {
          commentId_userId: {
            commentId: commentId,
            userId: user.id,
          },
        },
      });
    } else {
      return await prisma.commentVote.update({
        where: {
          commentId_userId: {
            commentId: commentId,
            userId: user.id,
          },
        },
        data: {
          type,
        },
      });
    }
  });
