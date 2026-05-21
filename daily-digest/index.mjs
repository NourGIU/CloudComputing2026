import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({ region: "eu-north-1" });

export const handler = async () => {

    await sns.send(
        new PublishCommand({
            TopicArn: "arn:aws:sns:eu-north-1:762682890039:mini-jira-daily-digest-topic",
            Subject: "Mini Jira Daily Digest",
            Message: "Daily digest executed successfully."
        })
    );

    return {
        statusCode: 200,
        body: "Digest sent"
    };
};