import { z } from "zod";
import { VoteType } from "@/generated/prisma/enums";

export const createPostSchema = z.object({
  title: z.string().nonempty(),
  content: z.string(),
  subredditId: z.string().nonempty(),
});

export const updatePostSchema = createPostSchema
  .extend({ id: z.ulid().nonempty() })
  .partial({
    subredditId: true,
    title: true,
    content: true,
  });

export const deletePostSchema = z.object({
  id: z.ulid().nonempty(),
});

export const getPostSchema = z.object({
  id: z.ulid().nonempty(),
});

export const votePostSchema = z.object({
  postId: z.ulid().nonempty(),
  type: z.enum(VoteType),
});
