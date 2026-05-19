import express from "express";
import {
  addComment,
  getCommentsByTask,
} from "../controllers/comments.controller.js";

const router = express.Router();

router.post("/:taskId/comments", addComment);
router.get("/:taskId/comments", getCommentsByTask);

export default router;
