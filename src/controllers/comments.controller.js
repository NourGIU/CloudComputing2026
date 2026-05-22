import { v4 as uuidv4 } from "uuid";
import { PutCommand, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, tables } from "../config/dynamo.js";

const isManager = (user) => user?.role === "Manager";
const isEmployee = (user) => user?.role === "Employee";
const FORBIDDEN_TEAM_MESSAGE =
  "Forbidden: You cannot access tasks from another team";

const isAssignedToUser = (user, task) =>
  task?.assigneeId === user?.userId || task?.assigneeId === user?.email;

const canAccessTask = (user, task) =>
  isManager(user) ||
  (isEmployee(user) &&
    task?.teamId === user?.teamId &&
    isAssignedToUser(user, task));

const logTaskTeamCheck = (req, task) => {
  console.log("Authenticated user:", req.user);
  console.log("Task team:", task.teamId, "User team:", req.user?.teamId);
};

const forbidOtherTeamTask = (res) =>
  res.status(403).json({ error: FORBIDDEN_TEAM_MESSAGE });

const getUserDisplayName = (user) =>
  user?.email || user?.userId || "unknown";

const getTask = async (taskId) => {
  const result = await ddb.send(new GetCommand({ TableName: tables.TASKS, Key: { taskId } }));
  return result.Item;
};

export const addComment = async (req, res) => {
  const user = req.user;
  const { taskId } = req.params;
  const { text } = req.body;

  if (!user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (!text) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  try {
    const task = await getTask(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    logTaskTeamCheck(req, task);

    if (!canAccessTask(user, task)) {
      return forbidOtherTeamTask(res);
    }

    const comment = {
      commentId: uuidv4(),
      taskId,
      userId: user.userId,
      userName: getUserDisplayName(user),
      text,
      createdAt: new Date().toISOString(),
    };

    await ddb.send(new PutCommand({ TableName: tables.COMMENTS, Item: comment }));
    return res.status(201).json(comment);
  } catch (error) {
    console.error("addComment error", error);
    return res.status(500).json({ error: "Failed to add comment" });
  }
};

export const getCommentsByTask = async (req, res) => {
  const user = req.user;
  const { taskId } = req.params;

  if (!user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const task = await getTask(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    logTaskTeamCheck(req, task);

    if (!canAccessTask(user, task)) {
      return forbidOtherTeamTask(res);
    }

    const result = await ddb.send(
      new QueryCommand({
        TableName: tables.COMMENTS,
        IndexName: "taskId-index",
        KeyConditionExpression: "taskId = :taskId",
        ExpressionAttributeValues: {
          ":taskId": taskId,
        },
      })
    );

    return res.status(200).json(result.Items || []);
  } catch (error) {
    console.error("getCommentsByTask error", error);
    return res.status(500).json({ error: "Failed to fetch comments" });
  }
};
