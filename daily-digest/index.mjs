import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const sns = new SNSClient({ region: process.env.AWS_REGION || "eu-north-1" });
const ddb = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-north-1" });

const getString = (item, key, fallback = "") => {
    const value = item[key];

    if (!value) return fallback;
    if (typeof value === "string") return value;
    return value.S || value.N || fallback;
};

export const handler = async () => {
    const table = process.env.TASKS_TABLE || "mini-jira-tasks";
    const topicArn = process.env.SNS_DAILY_DIGEST_TOPIC_ARN || process.env.SNS_TOPIC_ARN;
    const todayKey = new Date().toISOString().split("T")[0];

    if (!topicArn) {
        throw new Error("SNS_DAILY_DIGEST_TOPIC_ARN or SNS_TOPIC_ARN must be configured");
    }

    // Scan tasks and filter those with deadline matching today
    const scanRes = await ddb.send(new ScanCommand({ TableName: table }));
    const items = (scanRes.Items || []).filter((t) => {
        const deadline = getString(t, "deadline") || getString(t, "Deadline");
        return deadline.startsWith(todayKey);
    });

    if (items.length === 0) {
        await sns.send(new PublishCommand({
            TopicArn: topicArn,
            Subject: "Mini Jira Daily Digest",
            Message: `No tasks due today (${todayKey}).`
        }));

        return { statusCode: 200, body: "No tasks due today" };
    }

    const messageLines = items.map((t) => {
        const taskId = getString(t, "taskId") || getString(t, "TaskId", "unknown");
        const title = getString(t, "title") || getString(t, "Title", "(no title)");
        const assignee = getString(t, "assigneeName") || getString(t, "AssigneeName", "(unknown)");
        const deadline = getString(t, "deadline") || getString(t, "Deadline", "(no deadline)");
        return `${title} [${taskId}] - ${assignee} - due ${deadline}`;
    });

    await sns.send(new PublishCommand({
        TopicArn: topicArn,
        Subject: `Mini Jira Daily Digest - ${todayKey}`,
        Message: messageLines.join("\n")
    }));

    return { statusCode: 200, body: `Digest sent with ${items.length} items` };
};
