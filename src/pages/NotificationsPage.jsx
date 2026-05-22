import React, { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/activity")
      .then((r) => r.json())
      .then((items) => {
        // Show only assignment events as notifications
        const notifs = items.filter((i) => (i.action === "TASK_ASSIGNED" || i.eventType === "TASK_ASSIGNED"));
        setLogs(notifs);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {logs.length === 0 && <p>No notifications</p>}
      {logs.map((n) => (
        <div key={n.logId || n.taskId} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
          <div><strong>{n.assigneeName || n.action || n.eventType}</strong></div>
          <div>{n.taskId && `Task: ${n.taskId}`}</div>
          <div>{n.createdAt || n.changedAt}</div>
        </div>
      ))}
    </div>
  );
}
