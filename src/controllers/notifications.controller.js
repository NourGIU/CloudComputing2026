import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, tables } from "../config/dynamo.js";

const hasValue = (value) => Boolean(value && String(value).trim());

export const getNotificationStatus = async (req, res) => {
  try {
    const result = await ddb.send(
      new ScanCommand({
        TableName: tables.ACTIVITY_LOG,
      })
    );

    const logs = result.Items || [];
    const assignmentLogs = logs.filter(
      (item) => item.action === "TASK_ASSIGNED" || item.eventType === "TASK_ASSIGNED"
    );

    assignmentLogs.sort((a, b) => {
      const left = a.createdAt || a.changedAt || "";
      const right = b.createdAt || b.changedAt || "";
      return left < right ? 1 : -1;
    });

    return res.status(200).json({
      assignmentTopicConfigured: hasValue(
        process.env.SNS_TASK_ASSIGN_TOPIC_ARN || process.env.SNS_TOPIC_ARN
      ),
      assignmentTopicArn:
        process.env.SNS_TASK_ASSIGN_TOPIC_ARN || process.env.SNS_TOPIC_ARN || null,
      dailyDigestTopicConfigured: hasValue(
        process.env.SNS_DAILY_DIGEST_TOPIC_ARN || process.env.SNS_TOPIC_ARN
      ),
      workerActivityLogCount: assignmentLogs.length,
      lastAssignmentEvent: assignmentLogs[0] || null,
    });
  } catch (err) {
    console.error("getNotificationStatus error", err);
    return res.status(500).json({ error: "Failed to load notification status" });
  }
};
