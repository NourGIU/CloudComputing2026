import { v4 as uuidv4 } from "uuid";

import {
  PutCommand,
  ScanCommand,
  QueryCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import { ddb, tables } from "../config/dynamo.js";

const VALID_STATUSES = [
  "To Do",
  "In Progress",
  "In Review",
  "Done",
];

const fakeUser = {
  role: "Manager",
  name: "Nour",
  teamId: "team1",
};

const isManager = (user) =>
  user?.role === "Manager";

export const createTask = async (
  req,
  res
) => {

  const user =
    req.user || fakeUser;

  const {
    projectId,
    title,
    description,
    priority,
    deadline,
    assigneeId,
    assigneeName,
    teamId,
    imageOriginalKey,
    imageResizedKey,
  } = req.body;

  if (
    !title ||
    !projectId ||
    !teamId ||
    !assigneeId ||
    !assigneeName
  ) {
    return res.status(400).json({
      error:
        "Missing required task fields",
    });
  }

  const now =
    new Date().toISOString();

  const task = {
    taskId: uuidv4(),
    projectId,
    title,
    description:
      description || "",
    status: "To Do",
    priority:
      priority || "Medium",
    deadline: deadline || null,
    assigneeId,
    assigneeName,
    teamId,
    imageOriginalKey:
      imageOriginalKey || null,
    imageResizedKey:
      imageResizedKey || null,
    createdBy: user.name,
    createdAt: now,
    updatedAt: now,
  };

  try {

    await ddb.send(
      new PutCommand({
        TableName: tables.TASKS,
        Item: task,
      })
    );

    return res
      .status(201)
      .json(task);

  } catch (error) {

    console.error(
      "createTask error",
      error
    );

    return res.status(500).json({
      error:
        "Failed to create task",
    });
  }
};

export const getTasks = async (
  req,
  res
) => {

  try {

    const result =
      await ddb.send(
        new ScanCommand({
          TableName: tables.TASKS,
        })
      );

    return res
      .status(200)
      .json(result.Items || []);

  } catch (error) {

    console.error(
      "getTasks error",
      error
    );

    return res.status(500).json({
      error:
        "Failed to fetch tasks",
    });
  }
};

const getTask = async (
  taskId
) => {

  const result =
    await ddb.send(
      new GetCommand({
        TableName: tables.TASKS,
        Key: { taskId },
      })
    );

  return result.Item;
};

export const getTaskById =
  async (req, res) => {

    const { id } = req.params;

    try {

      const task =
        await getTask(id);

      if (!task) {
        return res
          .status(404)
          .json({
            error:
              "Task not found",
          });
      }

      return res
        .status(200)
        .json(task);

    } catch (error) {

      console.error(
        "getTaskById error",
        error
      );

      return res.status(500).json({
        error:
          "Failed to fetch task",
      });
    }
  };

export const updateTask =
  async (req, res) => {

    const { id } = req.params;

    const updates = req.body;

    try {

      const task =
        await getTask(id);

      if (!task) {
        return res
          .status(404)
          .json({
            error:
              "Task not found",
          });
      }

      const updatableFields = [
        "title",
        "description",
        "status",
        "priority",
        "deadline",
        "assigneeId",
        "assigneeName",
        "teamId",
        "imageOriginalKey",
        "imageResizedKey",
      ];

      const fields =
        Object.keys(
          updates
        ).filter((field) =>
          updatableFields.includes(
            field
          )
        );

      if (fields.length === 0) {
        return res
          .status(400)
          .json({
            error:
              "No valid fields provided for update",
          });
      }

      const expressionParts = [];

      const expressionAttributeNames =
        {};

      const expressionAttributeValues =
        {
          ":updatedAt":
            new Date().toISOString(),
        };

      fields.forEach(
        (field, index) => {

          const attributeName =
            `#field${index}`;

          const attributeValue =
            `:value${index}`;

          expressionAttributeNames[
            attributeName
          ] = field;

          expressionAttributeValues[
            attributeValue
          ] = updates[field];

          expressionParts.push(
            `${attributeName} = ${attributeValue}`
          );
        }
      );

      const updateExpression =
        `SET ${expressionParts.join(
          ", "
        )}, updatedAt = :updatedAt`;

      const result =
        await ddb.send(
          new UpdateCommand({
            TableName:
              tables.TASKS,

            Key: {
              taskId: id,
            },

            UpdateExpression:
              updateExpression,

            ExpressionAttributeNames:
              expressionAttributeNames,

            ExpressionAttributeValues:
              expressionAttributeValues,

            ReturnValues:
              "ALL_NEW",
          })
        );

      return res
        .status(200)
        .json(
          result.Attributes
        );

    } catch (error) {

      console.error(
        "updateTask error",
        error
      );

      return res.status(500).json({
        error:
          "Failed to update task",
      });
    }
  };

export const deleteTask =
  async (req, res) => {

    const { id } = req.params;

    try {

      await ddb.send(
        new DeleteCommand({
          TableName:
            tables.TASKS,

          Key: {
            taskId: id,
          },
        })
      );

      return res.status(200).json({
        success: true,
      });

    } catch (error) {

      console.error(
        "deleteTask error",
        error
      );

      return res.status(500).json({
        error:
          "Failed to delete task",
      });
    }
  };

export const updateTaskStatus =
  async (req, res) => {

    const user =
      req.user || fakeUser;

    const { id } = req.params;

    const { status } = req.body;

    if (
      !status ||
      !VALID_STATUSES.includes(
        status
      )
    ) {
      return res.status(400).json({
        error:
          "Invalid task status",
      });
    }

    try {

      const task =
        await getTask(id);

      if (!task) {
        return res
          .status(404)
          .json({
            error:
              "Task not found",
          });
      }

      const oldStatus =
        task.status || "To Do";

      const updatedAt =
        new Date().toISOString();

      await ddb.send(
        new UpdateCommand({
          TableName:
            tables.TASKS,

          Key: {
            taskId: id,
          },

          UpdateExpression:
            "SET #status = :status, updatedAt = :updatedAt",

          ExpressionAttributeNames:
            {
              "#status":
                "status",
            },

          ExpressionAttributeValues:
            {
              ":status":
                status,

              ":updatedAt":
                updatedAt,
            },

          ReturnValues:
            "ALL_NEW",
        })
      );

      const auditLog = {
        logId: uuidv4(),
        taskId: id,
        teamId: task.teamId,
        changedBy: user.name,
        oldStatus,
        newStatus: status,
        changedAt: updatedAt,
      };

      await ddb.send(
        new PutCommand({
          TableName:
            tables.ACTIVITY_LOG,

          Item: auditLog,
        })
      );

      return res.status(200).json({
        taskId: id,
        oldStatus,
        newStatus: status,
        changedAt: updatedAt,
      });

    } catch (error) {

      console.error(
        "updateTaskStatus error",
        error
      );

      return res.status(500).json({
        error:
          "Failed to update task status",
      });
    }
  };