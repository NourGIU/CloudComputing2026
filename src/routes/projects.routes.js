import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projects.controller.js";

const router = express.Router();

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
