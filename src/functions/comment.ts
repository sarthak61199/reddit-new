import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/middleware/auth";
import {
  createCommentSchema,
  deleteCommentSchema,
  getCommentsSchema,
  updateCommentSchema,
  voteCommentSchema,
} from "@/validations/comment";

export const getComments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator(getCommentsSchema)
  .handler();

export const createComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(createCommentSchema)
  .handler();

export const updateComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(updateCommentSchema)
  .handler();

export const deleteComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(deleteCommentSchema)
  .handler();

export const voteComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(voteCommentSchema)
  .handler();
