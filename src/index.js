import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectsRoutes from "./routes/projects.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import commentsRoutes from "./routes/comments.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Mini-Jira API is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/projects", projectsRoutes);
app.use("/tasks", tasksRoutes);
app.use("/tasks", commentsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
