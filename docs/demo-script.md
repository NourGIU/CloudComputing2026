# Mini Jira Demo Script

## Demo Goal

Demonstrate:
- Role-based access
- Team isolation
- Task management
- AWS integrations
- Notifications
- Monitoring
- Image upload workflow

---

# Demo Scenario

## Accounts Used

### Manager
- Ali

### Frontend Employee
- Sara

### Backend Employee
- Omar

---

# Step 1 — Manager Login

Ali logs into the system using Cognito authentication.

Expected result:
- Ali can access all teams and projects.
- Ali can create tasks and projects.

---

# Step 2 — Create Frontend Task

Ali creates Task A:

- Title: Frontend Landing Page
- Team: Frontend
- Assignee: Sara
- Status: To Do
- Priority: High

Ali uploads an image attachment.

Expected result:
- Task stored in DynamoDB.
- Image uploaded to S3.
- Lambda resizes image.
- SNS notification triggered.

---

# Step 3 — Create Backend Task

Ali creates Task B:

- Title: Backend Authentication API
- Team: Backend
- Assignee: Omar
- Status: To Do
- Priority: Medium

Expected result:
- Task stored successfully.
- Notification workflow triggered.

---

# Step 4 — Frontend Employee Login

Sara logs in.

Expected result:
- Sara sees ONLY Frontend team tasks.
- Sara can see Task A.
- Sara CANNOT see Backend tasks.

Sara updates task status:
- To Do → In Progress

Sara adds a comment.

---

# Step 5 — Backend Employee Login

Omar logs in.

Expected result:
- Omar sees ONLY Backend team tasks.
- Omar can see Task B.
- Omar CANNOT see Frontend tasks.

Omar updates task status:
- To Do → In Review

---

# Step 6 — Manager Verification

Ali logs back in.

Expected result:
- Ali sees both tasks.
- Ali can filter by team.
- Ali can review comments and task updates.

---

# Step 7 — Monitoring Demonstration

Show:
- CloudWatch dashboard
- EC2 metrics
- Task metrics
- Logs
- Alarm examples

---

# Step 8 — AWS Architecture Explanation

Explain:
- CloudFront
- ALB
- EC2
- DynamoDB
- S3
- Lambda
- SNS
- SQS
- EventBridge
- Cognito
- CloudWatch

---

# Step 9 — Cost Safety Explanation

Explain:
- Budget alerts
- Resource tracking
- Free-tier-safe rules
- Daily AWS monitoring

---

# Expected Final Outcome

The system demonstrates:
- Team-based task isolation
- CRUD operations
- Image upload workflow
- Event-driven architecture
- AWS monitoring
- High availability architecture
- Secure authentication and authorization