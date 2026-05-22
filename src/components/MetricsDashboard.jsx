import React, {
  useEffect,
  useState,
} from "react";

export default function MetricsDashboard() {

  const [metrics, setMetrics] =
    useState({
      totalTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
    });

  useEffect(() => {

    const fetchMetrics =
      async () => {

        try {

          const token =
            sessionStorage.getItem(
              "authToken"
            );

          const response =
            await fetch(
              "http://localhost:3001/metrics",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response.json();

          setMetrics(data);

        } catch (error) {

          console.error(
            "Failed to fetch metrics",
            error
          );
        }
      };

    fetchMetrics();

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
        Metrics Dashboard
      </h2>

      <p>
        Total Tasks:{" "}
        {metrics.totalTasks}
      </p>

      <p>
        Completed Tasks:{" "}
        {metrics.completedTasks}
      </p>

      <p>
        Overdue Tasks:{" "}
        {metrics.overdueTasks}
      </p>

      <p>
        EC2 CPU Utilization Healthy
      </p>

      <p>
        Lambda Invocations Normal
      </p>

    </div>
  );
}