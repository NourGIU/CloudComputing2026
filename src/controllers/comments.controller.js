import { v4 as uuidv4 } from "uuid";
import { PutCommand, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, tables } from "../config/dynamo.js";

const isManager = (user) => user?.role === "Manager";

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

    if (!isManager(user) && task.teamId !== user.teamId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const comment = {
      commentId: uuidv4(),
      taskId,
      userId: user.userId,
      userName: user.name,
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

    if (!isManager(user) && task.teamId !== user.teamId) {
      return res.status(403).json({ error: "Forbidden" });
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
