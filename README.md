# Mini Jira on AWS

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

The system is designed using:
- Multiple Availability Zones
- Auto Scaling Group
- Application Load Balancer
- CloudFront CDN

---

# Image Upload Workflow

1. User uploads task image
2. Image stored in S3
3. Lambda resizes image
4. Resized image stored in another S3 bucket

---

# Event-Driven Workflow

1. Manager assigns task
2. SNS publishes notification
3. SQS receives event
4. Worker Lambda processes event
5. CloudWatch metrics updated

---

# Monitoring

CloudWatch dashboard monitors:
- Tasks created
- Tasks closed
- EC2 CPU utilization
- Average task completion time

---

# Team Isolation

Employees can only access tasks belonging to their own team.

Managers can access all tasks.

---

# Demo Scenario

- Ali creates Frontend task for Sara
- Ali creates Backend task for Omar
- Sara sees only Frontend tasks
- Omar sees only Backend tasks
- Ali sees all tasks

---

# Project Documentation

Additional documentation is available in the `docs/` folder:
- aws-resources.md
- architecture.md
- cost-safety.md
- demo-script.md

---

# AWS Region

Current project region:
- Europe (Stockholm)

---

# Team Responsibilities

## Member 1
- Documentation
- Cost monitoring
- IAM coordination
- Resource tracking
- Architecture coordination
- Final submission preparation

---

# Cost Safety

To avoid unexpected AWS charges:
- Stop unused EC2 instances
- Avoid unnecessary NAT Gateways
- Monitor CloudWatch logs
- Track S3 storage
- Use free-tier-safe resources whenever possible