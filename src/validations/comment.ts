import { z } from "zod";
import { VoteType } from "@/generated/prisma/enums";

export const createCommentSchema = z.object({
  content: z.string().nonempty(),
  postId: z.ulid().nonempty(),
  parentId: z.ulid().optional(),
});

export const updateCommentSchema = createCommentSchema
  .extend({ id: z.ulid().nonempty() })
  .partial({
    content: true,
  });

export const deleteCommentSchema = z.object({
  id: z.ulid().nonempty(),
});

export const getCommentsSchema = z.object({
  postId: z.ulid().nonempty(),
});

export const voteCommentSchema = z.object({
  commentId: z.ulid().nonempty(),
  type: z.enum(VoteType),
});
