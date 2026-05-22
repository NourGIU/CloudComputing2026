import React, { useEffect, useState } from "react";

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/activity")
      .then((r) => r.json())
      .then(setLogs)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Activity Log</h2>
      <div>
        {logs.length === 0 && <p>No activity yet.</p>}
        {logs.map((log) => (
          <div key={log.logId || log.taskId} style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
            <div><strong>{log.action || log.eventType || log.changedBy}</strong></div>
            <div>{log.taskId && `Task: ${log.taskId}`}</div>
            <div>{log.teamId && `Team: ${log.teamId}`}</div>
            <div>{log.createdAt || log.changedAt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
