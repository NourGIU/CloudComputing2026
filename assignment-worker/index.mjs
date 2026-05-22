import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { CloudWatchClient, PutMetricDataCommand } from "@aws-sdk/client-cloudwatch";

const region = process.env.AWS_REGION || "eu-north-1";
const dynamodb = new DynamoDBClient({ region });
const cloudwatch = new CloudWatchClient({ region });

const parseAssignmentMessage = (recordBody) => {
    const parsed = JSON.parse(recordBody);

    if (parsed.Message) {
        return typeof parsed.Message === "string" ? JSON.parse(parsed.Message) : parsed.Message;
    }

    return parsed;
};

export const handler = async (event) => {

    for (const record of event.Records) {

        const message = parseAssignmentMessage(record.body);

        const now = new Date().toISOString();
        const logId = `${Date.now()}-${message.taskId || record.messageId || "assignment"}`;

        await dynamodb.send(
            new PutItemCommand({
                TableName: process.env.ACTIVITY_LOG_TABLE || "mini-jira-activity-log",
                Item: {
                    logId: { S: logId },
                    taskId: { S: message.taskId || "unknown" },
                    title: { S: message.title || "Task assigned" },
                    teamId: { S: message.teamId || "unknown" },
                    assigneeId: { S: message.assigneeId || "unknown" },
                    assigneeName: { S: message.assigneeName || "unknown" },
                    action: { S: "TASK_ASSIGNED" },
                    eventType: { S: message.eventType || "TASK_ASSIGNED" },
                    reason: { S: message.reason || "created" },
                    createdAt: { S: now }
                }
            })
        );

        await cloudwatch.send(
            new PutMetricDataCommand({
                Namespace: "MiniJira",
                MetricData: [
                    {
                        MetricName: "TasksAssignedPerTeam",
                        Dimensions: [
                            {
                                Name: "TeamId",
                                Value: message.teamId || "unknown"
                            }
                        ],
                        Unit: "Count",
                        Value: 1
                    }
                ]
            })
        );
    }

    return {
        statusCode: 200,
        body: "SUCCESS"
    };
};
