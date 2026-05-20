import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { CloudWatchClient, PutMetricDataCommand } from "@aws-sdk/client-cloudwatch";

const dynamodb = new DynamoDBClient({ region: "eu-north-1" });
const cloudwatch = new CloudWatchClient({ region: "eu-north-1" });

export const handler = async (event) => {

    for (const record of event.Records) {

        const snsEnvelope = JSON.parse(record.body);

        const message = JSON.parse(snsEnvelope.Message);

        const now = new Date().toISOString();

        await dynamodb.send(
            new PutItemCommand({
                TableName: "mini-jira-activity-log",
                Item: {
                    logId: { S: `${Date.now()}` },
                    taskId: { S: message.taskId || "unknown" },
                    teamId: { S: message.teamId || "unknown" },
                    action: { S: "TASK_ASSIGNED" },
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