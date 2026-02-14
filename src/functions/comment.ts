import { createServerFn } from "@tanstack/react-start";
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
  .handler(async ({ data: { postId } }) => {
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
    });

    return comments;
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
