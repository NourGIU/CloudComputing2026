import express from "express";
import cors from "cors";

import { mockAuth } from "./middleware/mockAuth.js";

import projectsRoutes from "./routes/projects.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import uploadsRoutes from "./routes/uploads.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import metricsRoutes from "./routes/metrics.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(mockAuth);

app.get("/", (req, res) => {
  res.json({ message: "Mini-Jira API is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/projects", projectsRoutes);
app.use("/tasks", tasksRoutes);
app.use("/tasks", commentsRoutes);
app.use("/uploads", uploadsRoutes);
app.use("/activity", activityRoutes);
app.use("/metrics", metricsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});