# Member 6 Setup and Testing Guide

This guide explains how to finish the Member 6 workflow, deploy the supporting AWS resources, and verify the complete task assignment and digest flow.

## What is included
- Backend publishes SNS assignment events when managers create tasks
- SNS topic with email subscription and SQS subscription
- SQS worker Lambda that writes `ActivityLog` and publishes CloudWatch custom metrics
- Daily Digest Lambda that checks tasks due today and sends digest emails via SNS
- CloudWatch dashboard with required metrics
- CloudWatch alarm for EC2 CPU utilization
- Frontend pages: Activity Log, Notifications, Dashboard, Overdue indicator

## Local test preparation

1. Install dependencies:
```bash
cd C:\Users\VICTUS\CloudComputing2026-1
cmd.exe /c "npm install"
```

2. Create a `.env` file from `.env.example` and set values:
- `AWS_REGION` (e.g. `eu-north-1`)
- `VITE_API_URL=http://localhost:3001`
- `TASKS_TABLE`
- `ACTIVITY_LOG_TABLE`
- `SNS_TASK_ASSIGN_TOPIC_ARN`
- `SNS_DAILY_DIGEST_TOPIC_ARN`

Example:
```env
AWS_REGION=eu-north-1
VITE_API_URL=http://localhost:3001
TASKS_TABLE=mini-jira-tasks
ACTIVITY_LOG_TABLE=mini-jira-activity-log
SNS_TASK_ASSIGN_TOPIC_ARN=arn:aws:sns:eu-north-1:123456789012:mini-jira-assignment-topic
SNS_DAILY_DIGEST_TOPIC_ARN=arn:aws:sns:eu-north-1:123456789012:mini-jira-daily-digest-topic
```

3. Start the backend API locally:
```bash
cmd.exe /c "cd C:\Users\VICTUS\CloudComputing2026-1 && node src/index.js"
```

4. If you want to start the frontend locally, use the existing Vite setup:
```bash
cmd.exe /c "cd C:\Users\VICTUS\CloudComputing2026-1 && npm run dev:web"
```

## Verify local server

The backend should respond on `/`:
```bash
cmd.exe /c "curl -s http://localhost:3001/"
```
Expected output:
```json
{"message":"Mini-Jira API is running"}
```

Note: `/metrics` and `/activity` require AWS DynamoDB access and configured resource names.

## AWS deployment steps

### 1. Deploy or create Task assignment SNS and SQS

Use the CloudFormation template at `deployment/member6-cloudformation.yaml`.

Required parameters:
- `NotificationEmail` (the email address that receives assignment notifications)
- `DailyDigestLambdaArn` (ARN of the deployed daily digest Lambda)
- `WorkerLambdaArn` (ARN of the assignment worker Lambda; optional if you deploy it separately)
- `EC2InstanceId` (ID of the EC2 instance to monitor)

Deploy:
```bash
aws cloudformation deploy \
  --template-file deployment/member6-cloudformation.yaml \
  --stack-name mini-jira-member6 \
  --parameter-overrides NotificationEmail=you@example.com DailyDigestLambdaArn=arn:aws:lambda:REGION:ACCOUNT:function:daily-digest WorkerLambdaArn=arn:aws:lambda:REGION:ACCOUNT:function:assignment-worker EC2InstanceId=i-0123456789abcdef0 \
  --capabilities CAPABILITY_NAMED_IAM
```

### 2. Confirm the email subscription

- Open the inbox for `NotificationEmail`
- Confirm the SNS subscription message

### 3. Deploy Lambda functions

#### Worker Lambda (`assignment-worker`)

Your worker code is in `assignment-worker/index.mjs`.

It expects SQS messages with an SNS envelope and does:
- parse `record.body`
- write `mini-jira-activity-log`
- publish `MiniJira/TasksAssignedPerTeam` metric

#### Daily Digest Lambda

Your daily digest code is in `daily-digest/index.mjs`.

It scans `TASKS_TABLE` and sends a digest via SNS if tasks are due today.

### 4. Configure Lambda triggers

- `assignment-worker` must be triggered by the SQS queue created by CloudFormation
- `daily-digest` is already triggered by EventBridge in the template at `cron(0 9 * * ? *)`

### 5. Set environment values

For the backend and Lambdas, set:
- `AWS_REGION`
- `TASKS_TABLE`
- `ACTIVITY_LOG_TABLE`
- `SNS_TASK_ASSIGN_TOPIC_ARN`
- `SNS_DAILY_DIGEST_TOPIC_ARN`

## Test the full assignment event flow

1. Create a task using the backend API:
```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "projectId":"proj-1",
    "title":"Test assignment",
    "description":"Verify SNS/SQS/worker flow",
    "teamId":"team1",
    "assigneeId":"user-1",
    "assigneeName":"User One",
    "deadline":"2026-05-22T09:00:00Z"
  }'
```

2. Verify the task is saved in DynamoDB.
3. Confirm SNS published the assignment email to the subscriber.
4. Confirm SQS queue received the message.
5. Confirm the worker Lambda consumed the SQS message and wrote a record into `mini-jira-activity-log`.
6. Confirm `MiniJira/TasksAssignedPerTeam` metric appears in CloudWatch.
7. Change task status to `Done` and confirm `TasksClosedPerTeam` and `TimeToCloseSeconds` metrics appear.

## Test daily digest flow

1. Create a task with `deadline` set to today.
2. Wait until 9:00 AM UTC (or manually invoke the daily digest Lambda).
3. Verify SNS sends the digest email.

## Verify dashboard and alarm

- Open CloudWatch dashboard `mini-jira-dashboard`
- Confirm widgets for:
  - Tasks Created Per Day
  - Tasks Closed Per Day Per Team
  - Average Time To Close
  - EC2 CPU Utilization
- Confirm the alarm `mini-jira-ec2-high-cpu` exists and monitors the correct EC2 instance

## What I have completed in code
- SNS publish on task assignment in `src/controllers/tasks.controller.js`
- SQS worker activity log and metric publishing in `assignment-worker/index.mjs`
- Daily digest Lambda in `daily-digest/index.mjs`
- CloudFormation template for SNS, SQS, EventBridge, dashboard, alarm in `deployment/member6-cloudformation.yaml`
- Frontend pages and overdue indicator in `src/pages/*`, `src/components/*`, and routing
- Backend routes for `/activity` and `/metrics`

## Limitations in this local environment
- The local API starts successfully.
- `/metrics` and `/activity` require AWS DynamoDB access and configured resource tables.
- Full workflow verification requires deployed AWS resources and valid AWS credentials.

## If you want me to finish the deployment wiring
I can also extend the CloudFormation template to create the worker and daily digest Lambda functions directly, including IAM roles and SQS event source mapping.
