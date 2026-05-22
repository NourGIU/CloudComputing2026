import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const sns = new SNSClient({ region: process.env.AWS_REGION || "eu-north-1" });
const ddb = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-north-1" });

export const handler = async () => {
    const table = process.env.TASKS_TABLE || "mini-jira-tasks";
    const todayKey = new Date().toISOString().split("T")[0];

    // Scan tasks and filter those with deadline matching today
    const scanRes = await ddb.send(new ScanCommand({ TableName: table }));
    const items = (scanRes.Items || []).filter((t) => {
        const d = t.deadline || t.Deadline || null;
        if (!d) return false;
        const val = typeof d === "string" ? d : d.S || null;
        return val && val.startsWith(todayKey);
    });

    if (items.length === 0) {
        await sns.send(new PublishCommand({
            TopicArn: process.env.SNS_DAILY_DIGEST_TOPIC_ARN || process.env.SNS_TOPIC_ARN,
            Subject: "Mini Jira Daily Digest",
            Message: `No tasks due today (${todayKey}).`
        }));

        return { statusCode: 200, body: "No tasks due today" };
    }

    const messageLines = items.map((t) => {
        const taskId = t.taskId || (t.TaskId && t.TaskId.S) || "unknown";
        const title = t.title || (t.Title && t.Title.S) || "(no title)";
        const assignee = t.assigneeName || (t.AssigneeName && t.AssigneeName.S) || "(unknown)";
        const deadline = t.deadline || (t.Deadline && t.Deadline.S) || "(no deadline)";
        return `${title} [${taskId}] - ${assignee} - due ${deadline}`;
    });

    await sns.send(new PublishCommand({
        TopicArn: process.env.SNS_DAILY_DIGEST_TOPIC_ARN || process.env.SNS_TOPIC_ARN,
        Subject: `Mini Jira Daily Digest - ${todayKey}`,
        Message: messageLines.join("\n")
    }));

    return { statusCode: 200, body: `Digest sent with ${items.length} items` };
};