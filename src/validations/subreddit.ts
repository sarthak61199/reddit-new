import { z } from "zod";

export const createSubredditSchema = z.object({
  name: z.string().nonempty(),
  description: z.string(),
});

export const updateSubredditSchema = createSubredditSchema
  .extend({ id: z.ulid().nonempty() })
  .partial({
    description: true,
  });

export const deleteSubredditSchema = z.object({
  id: z.ulid().nonempty(),
});

export const getSubredditSchema = z.object({
  id: z.ulid().nonempty(),
});

export const addSubredditModeratorSchema = z.object({
  subredditId: z.ulid().nonempty(),
  userId: z.ulid().nonempty(),
});

export const removeSubredditModeratorSchema = z.object({
  subredditId: z.ulid().nonempty(),
  userId: z.ulid().nonempty(),
});

export const joinUnjoinSubredditSchema = z.object({
  subredditId: z.ulid().nonempty(),
});
