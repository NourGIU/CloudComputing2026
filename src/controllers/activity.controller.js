import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, tables } from "../config/dynamo.js";

export const getActivityLogs = async (req, res) => {
  try {
    const result = await ddb.send(new ScanCommand({ TableName: tables.ACTIVITY_LOG }));
    const items = result.Items || [];
    // sort by createdAt if present
    items.sort((a, b) => {
      const ta = a.createdAt || a.changedAt || "";
      const tb = b.createdAt || b.changedAt || "";
      return ta < tb ? 1 : -1;
    });
    return res.status(200).json(items);
  } catch (err) {
    console.error("getActivityLogs error", err);
    return res.status(500).json({ error: "Failed to fetch activity logs" });
  }
};

export const writeActivityLog = async (log) => {
  try {
    await ddb.send(new PutCommand({ TableName: tables.ACTIVITY_LOG, Item: log }));
  } catch (err) {
    console.error("writeActivityLog error", err);
  }
};
