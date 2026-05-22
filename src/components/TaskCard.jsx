import React from "react";

const STATUS_OPTIONS = [
  "To Do",
  "In Progress",
  "In Review",
  "Done",
];

export default function TaskCard({
  task,
  onStatusChange,
  onSelectTask,
  onDeleteTask,
}) {

  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    task.status !== "Done";

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "12px",
        background: "#fff",
      }}
    >

      <h4
        style={{
          cursor: "pointer",
        }}
        onClick={() =>
          onSelectTask(task)
        }
      >
        {task.title}
      </h4>

      <p>
        {task.description}
      </p>

      <p>
        <strong>
          Assignee:
        </strong>{" "}
        {task.assigneeName}
      </p>

      <p>
        <strong>
          Project:
        </strong>{" "}
        {task.projectId}
      </p>

      <p>
        <strong>
          Deadline:
        </strong>{" "}
        {task.deadline || "Not set"}
      </p>

      {isOverdue && (
        <p
          style={{
            color: "red",
            fontWeight: "bold",
          }}
        >
          OVERDUE
        </p>
      )}

      <div
        style={{
          marginTop: "10px",
        }}
      >

        <label>
          Status

          <select
            value={task.status}
            onChange={(e) =>
              onStatusChange(
                task.taskId,
                e.target.value
              )
            }
            style={{
              marginLeft: "8px",
            }}
          >
            {STATUS_OPTIONS.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              )
            )}
          </select>
        </label>
      </div>

      <button
        onClick={() =>
          onDeleteTask(task.taskId)
        }
        style={{
          marginTop: "12px",
          background: "red",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Delete Task
      </button>
    </div>
  );
}