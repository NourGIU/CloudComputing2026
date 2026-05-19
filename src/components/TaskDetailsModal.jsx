import React from "react";
import CommentsSection from "./CommentsSection.jsx";

export default function TaskDetailsModal({ task, onClose }) {
  if (!task) {
    return null;
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", padding: "24px" }}>
      <div style={{ background: "white", borderRadius: "12px", width: "100%", maxWidth: "700px", padding: "24px", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", right: "16px", top: "16px" }}>Close</button>
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Assignee:</strong> {task.assigneeName} ({task.assigneeId})</p>
        <p><strong>Project ID:</strong> {task.projectId}</p>
        <p><strong>Team ID:</strong> {task.teamId}</p>
        <p><strong>Deadline:</strong> {task.deadline || "Not set"}</p>
        <p><strong>Created By:</strong> {task.createdBy}</p>
        <p><strong>Updated At:</strong> {task.updatedAt}</p>

        <CommentsSection taskId={task.taskId} />
      </div>
    </div>
  );
}
