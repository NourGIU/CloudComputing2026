# Mini Jira on AWS — High Availability & Event-Driven Architecture

A lightweight Jira/Trello-style task management system fully hosted on AWS.

This project supports:
- Managers
- Employees
- Teams
- Projects
- Tasks
- Comments
- File uploads
- Notifications
- Monitoring

---

# Project Overview

The system allows managers to create and assign tasks to employees based on teams.

Employees can:
- View their own team tasks
- Update task status
- Add comments
- Upload files/images

Managers can:
- View all tasks
- Assign tasks to any team
- Monitor progress

---

# Features

- Team-based task management
- Manager and employee roles
- Task assignment workflow
- Kanban-style task lifecycle
- Task comments
- Image/file uploads
- Event-driven notifications
- Daily digest reminders
- AWS serverless processing
- Monitoring and logging
- Team isolation and access control
- High availability architecture

---

# Task Lifecycle

Tasks move through the following states:

To Do → In Progress → In Review → Done

---

# AWS Services Used

| Service | Purpose |
|---|---|
| EC2 | Hosts backend application |
| Application Load Balancer | Distributes traffic |
| CloudFront | CDN for frontend delivery |
| DynamoDB | Stores application data |
| S3 | Stores uploaded images |
| Lambda | Background processing |
| SNS | Notifications |
| SQS | Queue processing |
| EventBridge | Scheduled jobs |
| Cognito | Authentication |
| CloudWatch | Monitoring and logging |
| IAM | Security and permissions |

---

# DynamoDB Tables

- mini-jira-users
- mini-jira-teams
- mini-jira-projects
- mini-jira-tasks
- mini-jira-comments
- mini-jira-activity-log

---

# High Availability Architecture

![Mini Jira AWS Architecture](docs/screenshots/architecture/mini-jira-architecture.png)

The system architecture includes:
- CloudFront CDN
- Application Load Balancer
- Target Group health checks
- EC2 backend instances
- Auto Scaling Group
- DynamoDB scalable storage
- S3 image storage
- Lambda serverless processing
- Event-driven processing using SNS, SQS, and EventBridge
- CloudWatch monitoring and alarms

The backend infrastructure deployment setup and AWS integration scripts are included as part of the infrastructure implementation.

---

# Image Upload Workflow

1. User uploads task image
2. Image stored in S3
3. Lambda resizes image
4. Resized image stored in another S3 bucket

Current deployed S3 buckets:
- mini-jira-original-images1
- mini-jira-resized-images1

---

# Event-Driven Workflow

1. Manager assigns task
2. SNS publishes notification
3. SQS receives assignment event
4. Assignment Worker Lambda processes the event
5. Activity logs are written
6. CloudWatch custom metrics are updated
7. Daily digest reminders are triggered using EventBridge and Lambda

---

# Monitoring

CloudWatch monitoring setup includes:
- Dashboard widgets
- CloudWatch alarms
- Custom task activity metrics
- Assignment worker monitoring
- Task activity tracking
- Lambda execution monitoring
- SQS monitoring and alerts

Monitoring screenshots are available in the repository screenshots folder.

---

# Authentication

Amazon Cognito is used for:
- User authentication
- Login and signup management
- Secure access control

Configured Cognito resource:
- mini-jira-app-client

---

# Team Isolation

Employees can only access tasks belonging to their own team.

Filtering is enforced on the backend using:
- teamId filtering
- DynamoDB Global Secondary Indexes (GSI)

Managers can access all tasks and teams.

---

# Project Documentation

Additional documentation is available in the `docs/` folder:
- aws-resources.md
- architecture.md
- cost-safety.md

---

# AWS Region

Current project region:
- Europe (Stockholm) — eu-north-1

---

# Current Project Progress

Completed components currently include:
- DynamoDB tables
- Core APIs
- Frontend integration
- S3 image upload buckets
- Lambda image resize workflow
- Assignment worker Lambda
- Daily digest Lambda
- SNS notification setup
- SQS queue integration
- EventBridge scheduled rule
- CloudWatch dashboard and alarms
- Cognito authentication setup
- Application Load Balancer
- Auto Scaling setup
- Infrastructure deployment setup
- Project documentation and cost monitoring

---

# Cost Safety

To avoid unexpected AWS charges:
- Stop unused EC2 instances
- Avoid unnecessary NAT Gateways
- Monitor CloudWatch logs
- Track S3 storage
- Release unused Elastic IPs
- Use free-tier-safe resources whenever possible


demo vedio:
https://drive.google.com/drive/folders/1mZabFLIxCWYuCrStggLp52E3A01gI5Ft

deployement link:
http://mini-jira-alb-46965766.eu-north-1.elb.amazonaws.com
https://d2agh87v0ldb6c.cloudfront.net
