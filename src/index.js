import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectsRoutes from "./routes/projects.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import { authenticateCognitoToken } from "./middleware/auth.middleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Mini-Jira API is running" });
});

app.use("/projects", authenticateCognitoToken, projectsRoutes);
app.use("/tasks", authenticateCognitoToken, tasksRoutes);
app.use("/tasks", authenticateCognitoToken, commentsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
