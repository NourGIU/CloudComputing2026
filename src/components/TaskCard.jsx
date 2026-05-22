import React from "react";

const STATUS_OPTIONS = ["To Do", "In Progress", "In Review", "Done"];

export default function TaskCard({ task, onStatusChange, onSelectTask }) {
  const isOverdue = (() => {
    if (!task.deadline) return false;
    if (task.status === "Done") return false;
    const dl = new Date(task.deadline);
    const now = new Date();
    return dl < now;
  })();
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "12px", marginBottom: "12px", background: "#fff" }}>
      <h4 style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }} onClick={() => onSelectTask(task)}>
        <span>{task.title}</span>
        {isOverdue && <span style={{ background: "#ff4d4f", color: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>Overdue</span>}
      </h4>
      <p>{task.description}</p>
      <p><strong>Assignee:</strong> {task.assigneeName}</p>
      <p><strong>Project:</strong> {task.projectId}</p>
      <p><strong>Deadline:</strong> {task.deadline || "Not set"}</p>
      <div>
        <label>
          Status
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.taskId, e.target.value)}
            style={{ marginLeft: "8px" }}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
