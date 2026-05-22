import { ScanCommand } from "@aws-sdk/lib-dynamodb";

import { ddb, tables } from "../config/dynamo.js";

export const getMetrics =
  async (req, res) => {

    try {

      const result =
        await ddb.send(
          new ScanCommand({
            TableName:
              tables.TASKS,
          })
        );

      const tasks =
        result.Items || [];

      const totalTasks =
        tasks.length;

      const completedTasks =
        tasks.filter(
          (task) =>
            task.status === "Done"
        ).length;

      const overdueTasks =
        tasks.filter(
          (task) =>
            task.deadline &&
            new Date(task.deadline) <
              new Date() &&
            task.status !== "Done"
        ).length;

      res.json({
        totalTasks,
        completedTasks,
        overdueTasks,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          "Failed to fetch metrics",
      });
    }
  };