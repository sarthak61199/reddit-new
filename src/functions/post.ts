import { createServerFn } from "@tanstack/react-start";
import {
  createPostSchema,
  deletePostSchema,
  getPostSchema,
  updatePostSchema,
  votePostSchema,
} from "@/validations/post";
import { authMiddleware } from "@/middleware/auth";

export const getPosts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler();

export const getPost = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator(getPostSchema)
  .handler();

export const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(createPostSchema)
  .handler();

export const updatePost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(updatePostSchema)
  .handler();

export const deletePost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(deletePostSchema)
  .handler();

export const votePost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(votePostSchema)
  .handler();
