import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMetrics = async () => {
      setError(null);

      try {
        const response = await api.get("/metrics");
        setMetrics(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard metrics.");
      }
    };

    loadMetrics();
  }, []);

  if (error) return <p className="error-message">{error}</p>;
  if (!metrics) return <div>Loading metrics...</div>;

  const createdTotal = Object.values(metrics.createdPerDay || {}).reduce(
    (sum, value) => sum + value,
    0
  );
  const closedTotal = Object.values(metrics.closedPerDayPerTeam || {}).reduce(
    (teamSum, days) =>
      teamSum + Object.values(days).reduce((sum, value) => sum + value, 0),
    0
  );

  return (
    <div className="page-stack">
      <header>
        <h1>Metrics Dashboard</h1>
        <p className="muted-text">Application metrics mirrored by the required CloudWatch dashboard.</p>
      </header>

      <section className="metric-grid">
        <div className="metric-card">
          <span>Tasks Created</span>
          <strong>{createdTotal}</strong>
          <small>All recorded days</small>
        </div>
        <div className="metric-card">
          <span>Tasks Closed</span>
          <strong>{closedTotal}</strong>
          <small>Grouped by team</small>
        </div>
        <div className="metric-card">
          <span>Average Time To Close</span>
          <strong>{metrics.avgTimeToClose ? `${metrics.avgTimeToClose.toFixed(2)}h` : "N/A"}</strong>
          <small>Done tasks only</small>
        </div>
        <div className="metric-card">
          <span>EC2 CPU Utilization</span>
          <strong>CloudWatch</strong>
          <small>Live widget and alarm in AWS</small>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="table-panel">
          <h2>Tasks Created Per Day</h2>
          <pre>{JSON.stringify(metrics.createdPerDay || {}, null, 2)}</pre>
        </section>

        <section className="table-panel">
          <h2>Tasks Closed Per Day Per Team</h2>
          <pre>{JSON.stringify(metrics.closedPerDayPerTeam || {}, null, 2)}</pre>
        </section>
      </div>
    </div>
  );
}
