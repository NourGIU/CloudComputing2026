import React from "react";

import ActivityLog from "./ActivityLog";
import NotificationStatus from "./NotificationStatus";
import MetricsDashboard from "./MetricsDashboard";

export default function Dashboard() {

  return (
    <div
      style={{
        padding: "20px",
      }}
    >

      <h1>
        Dashboard
      </h1>

      <MetricsDashboard />

      <NotificationStatus />

      <ActivityLog />

    </div>
  );
}