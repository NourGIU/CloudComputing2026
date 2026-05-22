import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/activity");
        setLogs(response.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load activity logs.");
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  return (
    <div className="page-stack">
      <header>
        <h1>Activity Log</h1>
        <p className="muted-text">Worker Lambda assignment events and task status changes.</p>
      </header>

      {loading && <p>Loading activity...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="table-panel">
          {logs.length === 0 && <p>No activity yet.</p>}
          {logs.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Task</th>
                  <th>Team</th>
                  <th>Details</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.logId || `${log.taskId}-${log.createdAt || log.changedAt}`}>
                    <td>{log.action || log.eventType || "STATUS_CHANGED"}</td>
                    <td>{log.title || log.taskId || "Unknown"}</td>
                    <td>{log.teamId || "Unknown"}</td>
                    <td>
                      {log.assigneeName && `Assigned to ${log.assigneeName}`}
                      {log.oldStatus && log.newStatus && `${log.oldStatus} -> ${log.newStatus}`}
                      {!log.assigneeName && !log.oldStatus && "Recorded by Member 6 flow"}
                    </td>
                    <td>{log.createdAt || log.changedAt || "Unknown"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
