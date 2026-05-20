# AWS Resource Tracking

## Region

Current AWS region:
- Europe (Stockholm) — eu-north-1

---

# Billing and Cost Monitoring

## Budget Status

Budget name:
- mini-jira-budget

Budget limit:
- $1.00

Status:
- Healthy

Cost anomaly detection:
- Enabled
- No anomalies detected

---

# EC2 Resources

## Current Status

No EC2 instances currently running.

Notes:
- Backend server not deployed yet.
- No EC2-related compute costs currently active.

---

# S3 Resources

## Current Status

No S3 buckets currently configured for the project.

Notes:
- Image upload storage not deployed yet.
- No active storage costs currently detected.

---

# DynamoDB Resources

## Existing Tables

- mini-jira-users
- mini-jira-teams
- mini-jira-projects
- mini-jira-tasks
- mini-jira-comments
- mini-jira-activity-log

Status:
- Active

Indexes:
- Some tables already contain indexes.

Notes:
- Backend EC2 IAM role still not available.
- DynamoDB permissions cannot yet be attached to backend role.

---

# Lambda Resources

## Existing Lambda Roles

- mini-jira-assignment-worker-role
- mini-jira-assignment-worker-role-kv00gtxo

Purpose:
- Background assignment processing
- Activity logging
- Metrics updates

---

# IAM Monitoring

## Current Findings

- No backend EC2 role found yet.
- Lambda IAM roles exist.
- DynamoDB access policy still pending backend role creation.

---

# Cost Safety Notes

Avoid creating without approval:
- NAT Gateway
- Extra Load Balancers
- Extra EC2 instances
- Elastic IPs
- Large S3 storage

Always verify:
- Running instances
- Storage growth
- Active services
- Billing alerts

---

# Infrastructure Status Summary

Currently deployed:
- DynamoDB tables
- Lambda roles
- Budget monitoring

Not yet deployed:
- Backend EC2 server
- S3 buckets
- Backend EC2 IAM role