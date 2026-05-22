import React, { useEffect, useState } from "react";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch("/metrics")
      .then((r) => r.json())
      .then(setMetrics)
      .catch((err) => console.error(err));
  }, []);

  if (!metrics) return <div>Loading metrics...</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <section style={{ background: "#fff", padding: 12 }}>
          <h3>Tasks Created Per Day</h3>
          <pre>{JSON.stringify(metrics.createdPerDay, null, 2)}</pre>
        </section>

        <section style={{ background: "#fff", padding: 12 }}>
          <h3>Tasks Closed Per Day Per Team</h3>
          <pre>{JSON.stringify(metrics.closedPerDayPerTeam, null, 2)}</pre>
        </section>

        <section style={{ background: "#fff", padding: 12 }}>
          <h3>Average Time To Close (hours)</h3>
          <div>{metrics.avgTimeToClose ? metrics.avgTimeToClose.toFixed(2) : "N/A"}</div>
        </section>

        <section style={{ background: "#fff", padding: 12 }}>
          <h3>EC2 CPU Utilization</h3>
          <div>See CloudWatch dashboard for live EC2 metrics.</div>
        </section>
      </div>
    </div>
  );
}
