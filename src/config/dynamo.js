import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Create a shared DynamoDB Document client for JSON-friendly DynamoDB operations.
const dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-north-1" });
export const ddb = DynamoDBDocumentClient.from(dynamoDbClient);

// Table names are configured through environment variables.
export const tables = {
  USERS: process.env.USERS_TABLE || "mini-jira-users",
  TEAMS: process.env.TEAMS_TABLE || "mini-jira-teams",
  PROJECTS: process.env.PROJECTS_TABLE || "mini-jira-projects",
  TASKS: process.env.TASKS_TABLE || "mini-jira-tasks",
  COMMENTS: process.env.COMMENTS_TABLE || "mini-jira-comments",
  ACTIVITY_LOG: process.env.ACTIVITY_LOG_TABLE || "mini-jira-activity-log",
};
