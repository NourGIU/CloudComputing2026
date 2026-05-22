# AWS Cost Safety Rules

This document helps protect the project from unexpected AWS charges and keeps all usage within free-tier-safe limits whenever possible.

---

# Important Rules

Team approval is required before creating:

- NAT Gateway
- Extra EC2 instances
- Extra Application Load Balancers
- Extra Target Groups
- Extra CloudFront distributions
- Elastic IPs
- Route 53 hosted zones
- Large S3 storage
- Additional Auto Scaling Groups
- Any paid AWS service outside free-tier-safe usage

---

# Current Project Infrastructure

Currently observed active infrastructure:

- 1 Application Load Balancer
- 1 Target Group
- CloudFront distribution enabled
- Multiple Lambda functions
- Auto Scaling backend infrastructure
- Multiple EC2 instances
- 2 allocated Elastic IPs
- S3 image storage buckets
- SNS + SQS messaging system
- EventBridge scheduled jobs
- CloudWatch monitoring

Current AWS region:
- Europe (Stockholm) — eu-north-1

---

# Daily AWS Checks

The following resources must be checked every day:

- EC2 running instances
- Auto Scaling Groups
- Load Balancers
- Target Groups
- NAT Gateways
- Elastic IPs
- CloudFront distributions
- S3 bucket storage
- Lambda errors and retries
- CloudWatch logs
- Billing dashboard

---

# EC2 Safety

Current observed backend:
- t3.micro instances

Rules:
- Stop unnecessary EC2 instances when not needed.
- Do not leave test instances running overnight.
- Use only required instance sizes.
- Avoid duplicate backend servers.
- Monitor Auto Scaling replacement behavior carefully.
- Verify unhealthy instances are terminated correctly.

Important:
- Auto Scaling may automatically create replacement instances.
- Always verify whether newly launched instances are intentional.

---

# Auto Scaling Safety

Observed behavior:
- Automatic unhealthy instance replacement active.

Rules:
- Do not increase desired capacity unnecessarily.
- Keep minimum and desired instance counts small.
- Monitor replacement loops carefully.
- Avoid scaling misconfiguration.

Important:
- Incorrect health checks can cause endless instance replacement.
- Continuous replacement may increase AWS usage costs.

---

# Load Balancer Safety

Current observed infrastructure:
- 1 ALB:
  - mini-jira-alb

Rules:
- Only one ALB should exist unless approved.
- Delete unused load balancers immediately.
- Monitor ALB hourly usage.
- Avoid duplicate target groups.

Important:
- Load Balancers are not fully free-tier covered.
- Long-running ALBs may generate charges.

---

# Target Group Safety

Current observed target group:
- mini-jira-tg

Rules:
- Do not create unnecessary target groups.
- Reuse existing target groups whenever possible.
- Remove unused targets.

---

# NAT Gateway Warning

NAT Gateway is NOT free-tier eligible and can become expensive quickly.

Rules:
- Do not create NAT Gateway without team approval.
- Delete immediately if testing is complete.
- Track active NAT Gateway usage daily.

Current observed state:
- No NAT Gateway detected

---

# Elastic IP Safety

Observed Elastic IPs:
- 13.50.23.120
- 13.51.224.162

Rules:
- Release unused Elastic IPs immediately.
- Do not allocate multiple Elastic IPs unnecessarily.
- Verify association status regularly.

Important:
- Unattached Elastic IPs may generate charges.

---

# CloudFront Safety

Current observed infrastructure:
- 1 active CloudFront distribution

Rules:
- Avoid creating duplicate distributions.
- Reuse the existing distribution whenever possible.
- Monitor data transfer usage.

Important:
- CloudFront usage outside free-tier limits may generate costs.

---

# S3 Storage Safety

Current buckets:
- mini-jira-original-images1
- mini-jira-resized-images1

Rules:
- Keep uploaded images small.
- Remove unnecessary files.
- Avoid duplicate uploads.
- Monitor bucket size regularly.
- Delete temporary testing uploads.

Important:
- Large image uploads increase storage costs.
- Excessive requests may increase charges.

---

# Lambda Safety

Current Lambda functions:
- MiniJiraImageResizer
- mini-jira-assignment-worker
- mini-jira-daily-worker
- mini-jira-daily-digest

Rules:
- Monitor retries and failures.
- Avoid infinite loops or recursive triggers.
- Keep execution times low.
- Monitor invocation counts regularly.

Important:
- Recursive S3 or SNS triggers may cause large charges.
- Continuous retries increase Lambda cost.

---

# SNS and SQS Safety

Rules:
- Avoid unnecessary message publishing.
- Monitor queue growth regularly.
- Verify dead-letter queue handling if configured.
- Prevent duplicate notification loops.

Important:
- Excessive messaging traffic may increase costs.

---

# CloudWatch Safety

Current monitoring:
- Dashboard widgets
- Metrics
- Alarms
- SQS monitoring alarms

Rules:
- Avoid excessive logging.
- Delete unnecessary log groups.
- Monitor log retention periods.
- Avoid excessive custom metrics.

Important:
- Large CloudWatch log storage may generate charges.

---

# Billing Monitoring

Billing dashboard should be checked daily.

Budget alerts must be enabled for:
- 25%
- 50%
- 75%
- 100%

Current budget:
- mini-jira-budget

Current status:
- Healthy

Cost anomaly detection:
- Enabled

---

# Region Consistency

All team members should use the same AWS region whenever possible to avoid confusion and duplicated resources.

Current project region:
- Europe (Stockholm) — eu-north-1

---

# Cost Prevention Checklist

Before leaving AWS:

Always verify:
- No unnecessary EC2 instances running
- No accidental NAT Gateway created
- No duplicate Load Balancers
- No unattached Elastic IPs
- No unnecessary CloudFront distributions
- No excessive CloudWatch logs
- No runaway Lambda invocations
- No excessive S3 uploads
- Auto Scaling behaving normally

---

# Current Infrastructure Monitoring Notes

Observed infrastructure status:
- Auto Scaling replacement activity detected
- Multiple terminated EC2 instances observed
- Running backend infrastructure active
- CloudFront distribution enabled
- ALB active and connected to target group
- Lambda infrastructure operational
- S3 image upload pipeline operational

Monitoring still required for:
- Elastic IP association status
- Auto Scaling stability
- Backend instance health consistency
- CloudWatch log growth