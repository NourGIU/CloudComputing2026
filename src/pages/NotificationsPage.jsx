import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function NotificationsPage() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      setError(null);

      try {
        const [activityResponse, statusResponse] = await Promise.all([
          api.get("/activity"),
          api.get("/notifications/status"),
        ]);

        const items = activityResponse.data || [];
        setLogs(
          items.filter(
            (item) => item.action === "TASK_ASSIGNED" || item.eventType === "TASK_ASSIGNED"
          )
        );
        setStatus(statusResponse.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load notification status.");
      }
    };

    loadNotifications();
  }, []);

  return (
    <div className="page-stack">
      <header>
        <h1>Notification Status</h1>
        <p className="muted-text">SNS email notifications and SQS worker processing health.</p>
      </header>

      {error && <p className="error-message">{error}</p>}

      <section className="metric-grid">
        <div className="metric-card">
          <span>SNS Assignment Topic</span>
          <strong>{status?.assignmentTopicConfigured ? "Configured" : "Missing"}</strong>
          <small>{status?.assignmentTopicArn || "Set SNS_TASK_ASSIGN_TOPIC_ARN"}</small>
        </div>
        <div className="metric-card">
          <span>Worker Activity Logs</span>
          <strong>{status?.workerActivityLogCount ?? 0}</strong>
          <small>SQS-triggered assignment records</small>
        </div>
        <div className="metric-card">
          <span>Daily Digest Topic</span>
          <strong>{status?.dailyDigestTopicConfigured ? "Configured" : "Missing"}</strong>
          <small>EventBridge sends digest at 9:00 AM</small>
        </div>
      </section>

      <section className="table-panel">
        <h2>Recent Assignment Notifications</h2>
        {logs.length === 0 && <p>No assignment notifications yet.</p>}
        {logs.map((notification) => (
          <article
            className="activity-row"
            key={notification.logId || `${notification.taskId}-${notification.createdAt}`}
          >
            <strong>{notification.title || notification.taskId || "Task assigned"}</strong>
            <span>
              {notification.assigneeName
                ? `Assigned to ${notification.assigneeName}`
                : "Assignment event processed"}
            </span>
            <small>{notification.createdAt || notification.changedAt}</small>
          </article>
        ))}
      </section>
    </div>
  );
}
