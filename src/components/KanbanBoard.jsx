import React from "react";
import TaskCard from "./TaskCard.jsx";

const STATUSES = ["To Do", "In Progress", "In Review", "Done"];

export default function KanbanBoard({ tasks, onStatusChange, onSelectTask }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
      {STATUSES.map((status) => (
        <div key={status} style={{ background: "#f4f4f4", padding: "12px", borderRadius: "8px" }}>
          <h3>{status}</h3>
          {tasks
            .filter((task) => task.status === status)
            .map((task) => (
              <TaskCard key={task.taskId} task={task} onStatusChange={onStatusChange} onSelectTask={onSelectTask} />
            ))}
        </div>
      ))}
    </div>
  );
}
