import express from "express";
import cors from "cors";

import { authenticateCognitoToken } from "./middleware/auth.middleware.js";

import projectsRoutes from "./routes/projects.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import uploadsRoutes from "./routes/uploads.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import metricsRoutes from "./routes/metrics.routes.js";
import activityLogsRoutes from "./routes/activityLogs.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

//app.use(mockAuth);

app.get("/", (req, res) => {
  res.json({ message: "Mini-Jira API is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/projects", authenticateCognitoToken, projectsRoutes);
app.use("/tasks", authenticateCognitoToken, tasksRoutes);
app.use("/tasks", authenticateCognitoToken, commentsRoutes);
app.use("/uploads", authenticateCognitoToken, uploadsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.use(
  "/activity-logs",
  authenticateCognitoToken,
  activityRoutes
);

app.use(
  "/metrics",
  authenticateCognitoToken,
  metricsRoutes
);

app.use(
  "/activity-logs",
  authenticateCognitoToken,
  activityLogsRoutes
);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});