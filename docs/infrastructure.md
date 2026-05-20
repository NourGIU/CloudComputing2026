# Mini-Jira Infrastructure

## Member 2 Scope

Member 2 is responsible for infrastructure and deployment documentation for the Mini-Jira AWS project. The deployment region is `eu-north-1`, and project resources should use the `mini-jira` prefix.

No AWS resources are created from this repository. This documentation records the intended setup and the manual AWS resources used for the course project.

## Level 1 Resources Created

- `mini-jira-vpc`
- `mini-jira-public-subnet-a`
- `mini-jira-public-subnet-b`
- `mini-jira-private-subnet-a`
- `mini-jira-private-subnet-b`
- `mini-jira-igw`
- `mini-jira-public-rt`
- `mini-jira-alb-sg`
- `mini-jira-ec2-sg`

## Future Level 2 Resources

- `mini-jira-asg`
- CloudFront distribution

## Health Check

Backend health check path:

```text
/health
```

Expected response:

```json
{ "status": "ok" }
```

The Application Load Balancer target group should use `/health` for health checks.

## Cost-Safety Notes

- No NAT Gateway.
- No Elastic IP.
- Use `t2.micro` or `t3.micro` only.
- One ALB only.
- One CloudFront distribution only.
- During development, ASG desired capacity should be `1` or `0`.
- After testing, set ASG desired capacity and minimum capacity to `0`.

## Level 2 Resources Created

- Launch Template: `mini-jira-launch-template`
- Target Group: `mini-jira-tg`
- Application Load Balancer: `mini-jira-alb`
- ALB DNS: `mini-jira-alb-46965766.eu-north-1.elb.amazonaws.com`
- Auto Scaling Group: `mini-jira-asg`
- CloudFront Distribution: `mini-jira-cloudfront`
- CloudFront URL: `https://d2agh87v0ldb6c.cloudfront.net`

## Test Results

### ALB Test

ALB root URL returned:

```text
Mini Jira infrastructure is working


The ALB successfully returned:

```json
{ "status": "ok" }

from:

http://mini-jira-alb-46965766.eu-north-1.elb.amazonaws.com/health

CloudFront root URL returned:

Mini Jira infrastructure is working

CloudFront health check returned:

{ "status": "ok" }