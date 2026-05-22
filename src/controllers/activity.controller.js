import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, tables } from "../config/dynamo.js";

export const getActivityLogs = async (req, res) => {
  try {

    const result = await ddb.send(
      new ScanCommand({
        TableName: tables.ACTIVITY_LOG,
      })
    );

    res.status(200).json(result.Items || []);

  } catch (error) {

    console.error(
      "getActivityLogs error",
      error
    );

    res.status(500).json({
      error: "Failed to fetch activity logs",
    });
  }
};