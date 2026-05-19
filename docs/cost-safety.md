# AWS Cost Safety Rules

This document helps protect the project from unexpected AWS charges and keeps all usage within free-tier-safe limits whenever possible.

## Important Rules

Member 1 approval is required before creating:

- NAT Gateway
- Extra EC2 instances
- Extra Application Load Balancers
- Elastic IPs
- Route 53 hosted zones
- Large S3 storage
- Any paid AWS service outside free-tier-safe usage

---

## Daily AWS Checks

The following resources must be checked every day:

- EC2 running instances
- Load Balancers
- NAT Gateways
- Elastic IPs
- S3 bucket storage
- Lambda errors and retries
- CloudWatch logs
- Billing dashboard

---

## EC2 Safety

- Stop EC2 instances when not being used.
- Do not leave unnecessary instances running overnight.
- Use only required instance sizes.
- Avoid creating duplicate servers.

---

## Load Balancer Safety

- Only one ALB should exist unless approved.
- Delete unused load balancers immediately.
- Monitor ALB hourly usage.

---

## NAT Gateway Warning

NAT Gateway is NOT free-tier eligible and can become expensive quickly.

Rules:
- Do not create NAT Gateway without team approval.
- Delete immediately if testing is complete.
- Track active NAT Gateway usage.

---

## Elastic IP Safety

Elastic IPs may generate charges if unused.

Rules:
- Release unused Elastic IPs immediately.
- Do not allocate multiple Elastic IPs unnecessarily.

---

## S3 Storage Safety

- Keep uploaded images small.
- Remove unnecessary files.
- Avoid duplicate uploads.
- Monitor bucket size regularly.

---

## CloudWatch Safety

- Avoid excessive logging.
- Delete unnecessary log groups.
- Monitor log retention periods.

---

## Lambda Safety

- Monitor retries and failures.
- Avoid infinite loops or recursive triggers.
- Keep execution times low.

---

## Billing Monitoring

Billing dashboard should be checked daily.

Budget alerts must be enabled for:
- 25%
- 50%
- 75%
- 100%

---

## Region Consistency

All team members should use the same AWS region whenever possible to avoid confusion and duplicated resources.

Current project region:
- Europe (Stockholm)