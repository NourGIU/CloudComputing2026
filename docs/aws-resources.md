# AWS Resources Tracking

This file tracks all AWS resources used in the Mini-Jira project to avoid cost problems and keep the team organized.

## Resource Table

| AWS Service | Resource Name | Purpose | Created By | Region | Status | Cost Risk | Notes |
|---|---|---|---|---|---|---|---|
| EC2 | Not created yet | Hosts backend server | TBD | Europe Stockholm | Pending | Medium | Stop when not in use |
| Application Load Balancer | Not created yet | Distributes traffic to EC2 | TBD | Europe Stockholm | Pending | High | Needs approval before creation |
| DynamoDB | mini-jira-users | Stores users | TBD | Europe Stockholm | Pending | Low | Required |
| DynamoDB | mini-jira-teams | Stores teams | TBD | Europe Stockholm | Pending | Low | Required |
| DynamoDB | mini-jira-projects | Stores projects | TBD | Europe Stockholm | Pending | Low | Required |
| DynamoDB | mini-jira-tasks | Stores tasks | TBD | Europe Stockholm | Pending | Low | Must include teamId and assigneeId indexes |
| DynamoDB | mini-jira-comments | Stores comments | TBD | Europe Stockholm | Pending | Low | Required |
| DynamoDB | mini-jira-activity-log | Stores activity log | TBD | Europe Stockholm | Pending | Low | Required |
| S3 | Not created yet | Stores uploaded task images | TBD | Europe Stockholm | Pending | Low/Medium | Keep storage small |
| Lambda | Not created yet | Resizes uploaded images | TBD | Europe Stockholm | Pending | Low | Check errors/retries |
| SNS | Not created yet | Sends notifications | TBD | Europe Stockholm | Pending | Low | Used for task assignment emails |
| SQS | Not created yet | Queues task assignment events | TBD | Europe Stockholm | Pending | Low | Used by worker Lambda |
| EventBridge | Not created yet | Runs daily digest Lambda | TBD | Europe Stockholm | Pending | Low | Runs daily at 9:00 AM |
| CloudWatch | Not created yet | Monitoring, logs, alarms | TBD | Europe Stockholm | Pending | Medium | Watch log storage |
| NAT Gateway | Not created yet | Internet access for private EC2 | TBD | Europe Stockholm | Not approved | High | Must not create without approval |
| Elastic IP | Not created yet | Static public IP | TBD | Europe Stockholm | Not approved | Medium/High | Avoid unless needed |

## Daily Check

- Check EC2 running instances.
- Check Load Balancers.
- Check NAT Gateways.
- Check Elastic IPs.
- Check S3 storage.
- Check Lambda errors and retries.
- Check CloudWatch logs.
- Check Billing Dashboard.