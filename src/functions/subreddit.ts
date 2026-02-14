import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/middleware/auth";
import {
  addSubredditMemberSchema,
  createSubredditSchema,
  deleteSubredditSchema,
  getSubredditSchema,
  removeSubredditMemberSchema,
  updateSubredditSchema,
} from "@/validations/subreddit";

export const getSubreddits = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler();

export const getSubreddit = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator(getSubredditSchema)
  .handler();

export const createSubreddit = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(createSubredditSchema)
  .handler();

export const updateSubreddit = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(updateSubredditSchema)
  .handler();

export const deleteSubreddit = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(deleteSubredditSchema)
  .handler();

export const addSubredditMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(addSubredditMemberSchema)
  .handler();

export const removeSubredditMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(removeSubredditMemberSchema)
  .handler();
