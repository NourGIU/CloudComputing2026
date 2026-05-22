import React from "react";

export default function NotificationStatus() {

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
        Notification Status
      </h2>

      <p>
        SNS Topic Connected
      </p>

      <p>
        SQS Queue Active
      </p>

      <p>
        Worker Lambda Running
      </p>

      <p>
        Daily Digest Enabled
      </p>

      <p>
        CloudWatch Monitoring Enabled
      </p>

    </div>
  );
}