# Member 6 — AWS Event-Driven Architecture

## Implemented AWS Services

- SNS Topic
- SNS Email Subscription
- SQS Queue
- SQS Subscription
- Assignment Worker Lambda
- DynamoDB Activity Logging
- CloudWatch Custom Metrics
- EventBridge Daily Scheduler
- Daily Digest Lambda
- CloudWatch Dashboard
- CloudWatch Alarm

---

# Assignment Event Flow

Manager assigns task  
→ SNS publishes event  
→ Email notification sent  
→ SQS queue receives message  
→ Lambda worker processes queue  
→ Activity log written to DynamoDB  
→ CloudWatch metric published

---

# Daily Digest Flow

EventBridge Scheduler runs every day at 9:00 AM Africa/Cairo timezone  
→ Daily Digest Lambda executes  
→ SNS sends digest email

---

# CloudWatch Monitoring

Dashboard widgets include:

- SQS Queue Metrics
- EC2/SQS Monitoring Graphs

Alarm includes:

- Queue message visibility monitoring

---

# AWS Region

eu-north-1 (Stockholm)

---

# Resources Created

- mini-jira-task-assignment-topic
- mini-jira-assignment-queue
- mini-jira-assignment-worker
- mini-jira-daily-digest
- mini-jira-dashboard
- mini-jira-sqs-alarm
- mini-jira-daily-digest-9am