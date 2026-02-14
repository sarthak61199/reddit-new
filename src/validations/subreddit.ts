import { z } from "zod";

export const createSubredditSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
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

export const addSubredditMemberSchema = z.object({
  subredditId: z.ulid().nonempty(),
  userId: z.ulid().nonempty(),
});

export const removeSubredditMemberSchema = z.object({
  subredditId: z.ulid().nonempty(),
  userId: z.ulid().nonempty(),
});
