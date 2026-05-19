import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../controllers/tasks.controller.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/status", updateTaskStatus);

export default router;
