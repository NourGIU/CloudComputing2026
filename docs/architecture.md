# Mini Jira AWS Architecture

## Overview

The Mini Jira system is a lightweight task-management application hosted fully on AWS.

The system supports:
- Managers
- Employees
- Teams
- Projects
- Tasks
- Comments
- Image uploads
- Notifications
- Monitoring

The architecture is designed for high availability and scalability across multiple AWS services.

---

# Main Architecture Flow

User → CloudFront → Application Load Balancer → EC2 Backend → AWS Services

The backend communicates with:
- DynamoDB
- S3
- Lambda
- SNS
- SQS
- CloudWatch
- Cognito

---

# AWS Services Used

## CloudFront

Purpose:
- Acts as CDN
- Improves performance
- Delivers frontend faster

---

## Application Load Balancer (ALB)

Purpose:
- Distributes traffic across EC2 instances
- Performs health checks
- Improves high availability

---

## EC2 (Auto Scaling Group)

Purpose:
- Hosts backend Node.js application
- Runs API routes and business logic

High Availability:
- Multiple EC2 instances across different Availability Zones

---

## DynamoDB

Purpose:
- Stores all project data

Tables:
- mini-jira-users
- mini-jira-teams
- mini-jira-projects
- mini-jira-tasks
- mini-jira-comments
- mini-jira-activity-log

Indexes:
- teamId
- assigneeId

---

## S3

Purpose:
- Stores uploaded task images
- Keeps image versions

Buckets:
- Originals bucket
- Resized images bucket

---

## Lambda Functions

### Image Resize Lambda

Triggered when:
- New image uploaded to S3

Purpose:
- Creates resized thumbnails

---

### Assignment Worker Lambda

Triggered by:
- SQS queue

Purpose:
- Writes activity logs
- Publishes CloudWatch metrics

---

### Daily Digest Lambda

Triggered by:
- EventBridge scheduled rule

Purpose:
- Sends daily task reminder emails

---

## SNS

Purpose:
- Sends task assignment notifications
- Sends digest emails

---

## SQS

Purpose:
- Buffers assignment events
- Decouples backend from background processing

---

## EventBridge

Purpose:
- Runs scheduled daily digest Lambda every morning

---

## Cognito

Purpose:
- Handles authentication
- Manages users and roles

Stores:
- Role
- teamId

---

## CloudWatch

Purpose:
- Monitoring
- Logging
- Metrics
- Alarms

Dashboard widgets:
- Tasks created per day
- Tasks closed per team
- Average task completion time
- EC2 CPU utilization

---

# Security

IAM roles and policies are used with least-privilege access.

The backend EC2 role includes DynamoDB permissions:
- PutItem
- GetItem
- UpdateItem
- DeleteItem
- Scan
- Query

---

# Team Isolation

Employees can only access tasks belonging to their own team.

Filtering is enforced on the backend server side using:
- teamId
- DynamoDB Global Secondary Indexes

Managers can access all teams and tasks.

---

# High Availability

The architecture uses:
- Multiple Availability Zones
- Load Balancer
- Auto Scaling
- CloudFront CDN

to improve reliability and uptime.