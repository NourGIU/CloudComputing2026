import React, {
  useEffect,
  useState,
} from "react";

export default function ActivityLog() {

  const [logs, setLogs] =
    useState([]);

  useEffect(() => {

    const fetchLogs =
      async () => {

        try {

          const token =
            sessionStorage.getItem(
              "authToken"
            );

          const response =
            await fetch(
              "http://localhost:3001/activity-logs",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response.json();

          setLogs(data);

        } catch (error) {

          console.error(
            "Failed to fetch activity logs",
            error
          );
        }
      };

    fetchLogs();

  }, []);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "20px",
        background: "#fff",
      }}
    >

      <h2>
        Activity Logs
      </h2>

      {logs.length === 0 ? (
        <p>
          No activity logs found
        </p>
      ) : (
        logs.map((log) => (
          <div
            key={log.logId}
            style={{
              borderBottom:
                "1px solid #eee",
              padding: "8px 0",
            }}
          >

            <p>
              <strong>
                {log.changedBy}
              </strong>
            </p>

            <p>
              {log.oldStatus}
              {" → "}
              {log.newStatus}
            </p>

            <p>
              Task ID:
              {" "}
              {log.taskId}
            </p>

            <p>
              {new Date(
                log.changedAt
              ).toLocaleString()}
            </p>

          </div>
        ))
      )}

    </div>
  );
}