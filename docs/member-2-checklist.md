# Member 2 Checklist

## Level 1 Completed

- [x] VPC planned with project prefix `mini-jira`.
- [x] Public subnet A: `mini-jira-public-subnet-a`.
- [x] Public subnet B: `mini-jira-public-subnet-b`.
- [x] Private subnet A: `mini-jira-private-subnet-a`.
- [x] Private subnet B: `mini-jira-private-subnet-b`.
- [x] Internet Gateway: `mini-jira-igw`.
- [x] Public route table: `mini-jira-public-rt`.
- [x] ALB security group: `mini-jira-alb-sg`.
- [x] EC2 security group: `mini-jira-ec2-sg`.
- [x] Backend health check endpoint documented as `/health`.
- [x] EC2 user-data test server script added.

## Level 2 AWS Checklist

- [ ] Create `mini-jira-launch-template`.
- [ ] Create `mini-jira-tg` with health check path `/health`.
- [ ] Create one ALB named `mini-jira-alb`.
- [ ] Create `mini-jira-asg`.
- [ ] Connect ASG instances to the target group.
- [ ] Create one CloudFront distribution pointing to the ALB.
- [ ] Add any required DNS or HTTPS settings if the course requires them.

## Verify After ALB

- [ ] ALB DNS name opens the Mini-Jira test server.
- [ ] `http://ALB-DNS-NAME/` returns `Mini Jira infrastructure is working`.
- [ ] `http://ALB-DNS-NAME/health` returns `{ "status": "ok" }`.
- [ ] Target group shows healthy instances.
- [ ] ASG desired capacity is `1` only while testing.

## Verify After CloudFront

- [ ] CloudFront distribution domain opens the Mini-Jira test server.
- [ ] `https://CLOUDFRONT-DOMAIN/health` returns `{ "status": "ok" }`.
- [ ] CloudFront origin points to the single project ALB.
- [ ] No extra ALB, NAT Gateway, Elastic IP, or large EC2 instance was created.

## Stop Resources After Testing

- [ ] Set ASG desired capacity to `0`.
- [ ] Set ASG minimum capacity to `0`.
- [ ] Confirm no test EC2 instances are still running.
- [ ] Keep only the required course resources active.
