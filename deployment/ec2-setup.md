# EC2 Test Server Setup

Member 2 owns the infrastructure and deployment setup for Mini-Jira. These notes are for a simple EC2 test server in `eu-north-1` using the `mini-jira` resource prefix.

## Use the User-Data Script

1. Create or update an EC2 Launch Template for the project.
2. Use Amazon Linux 2023 as the AMI.
3. Paste the contents of `deployment/ec2-user-data.sh` into the user-data field.
4. Use a small instance type only: `t2.micro` or `t3.micro`.
5. Attach the EC2 security group that allows inbound traffic from the ALB security group on port `3000`.

The script installs Node.js, npm, and git, writes a tiny test server to `/home/ec2-user/mini-jira/server.js`, and runs it with systemd as `mini-jira.service`.

## Test the EC2 Server

After the instance starts, connect with Session Manager or SSH if allowed by the course setup.

Check the service:

```bash
sudo systemctl status mini-jira.service
```

Test the root endpoint locally on the EC2 instance:

```bash
curl http://localhost:3000/
```

Expected response:

```text
Mini Jira infrastructure is working
```

Test the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{"status":"ok"}
```

The ALB target group health check path should be `/health`.

## Replace the Test Server Later

When the real backend is ready for deployment:

1. Clone or copy the Mini-Jira repository into `/home/ec2-user/mini-jira`.
2. Install production dependencies with `npm install` or `npm ci` if the lockfile is available.
3. Add environment variables through a safe deployment method, not in user-data with real secrets.
4. Update `mini-jira.service` so `ExecStart` runs the real backend start command.
5. Restart the service.

Example systemd command for the real backend:

```ini
ExecStart=/usr/bin/npm start
```

Alternative PM2 flow:

```bash
sudo npm install -g pm2
pm2 start src/index.js --name mini-jira
pm2 save
pm2 startup systemd
```

Use either PM2 or systemd for the real backend. For this student project, systemd is enough.

## Stop or Scale Down After Testing

To avoid unnecessary charges after testing, set the Auto Scaling Group desired capacity to `0`. Also set minimum capacity to `0` if the environment is not being used.

## Cost-Safety Warnings

- Do not create a NAT Gateway.
- Do not allocate an Elastic IP.
- Do not create extra ALBs.
- Do not use large EC2 instances.
- Use only `t2.micro` or `t3.micro`.
- Keep the ASG desired capacity at `1` only while testing, then change it back to `0`.
