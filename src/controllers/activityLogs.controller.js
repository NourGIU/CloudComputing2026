import {
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

import {
  ddb,
  tables,
} from "../config/dynamo.js";

export const getActivityLogs =
  async (req, res) => {

    try {

      const result =
        await ddb.send(
          new ScanCommand({
            TableName:
              tables.ACTIVITY_LOG,
          })
        );

      const logs =
        result.Items || [];

      logs.sort(
        (a, b) =>
          new Date(b.changedAt) -
          new Date(a.changedAt)
      );

      res.json(logs);

    } catch (error) {

      console.error(
        "getActivityLogs error",
        error
      );

      res.status(500).json({
        error:
          "Failed to fetch activity logs",
      });
    }
  };