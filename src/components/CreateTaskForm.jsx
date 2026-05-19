import React, { useState } from "react";
import api from "../api.js";

const STATUS_OPTIONS = ["To Do", "In Progress", "In Review", "Done"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

export default function CreateTaskForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [assigneeName, setAssigneeName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!title || !assigneeId || !assigneeName || !teamId || !projectId) {
      setError("Title, assignee, team ID, and project ID are required.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/tasks", {
        title,
        description,
        priority,
        deadline: deadline || null,
        assigneeId,
        assigneeName,
        teamId,
        projectId,
      });

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDeadline("");
      setAssigneeId("");
      setAssigneeName("");
      setTeamId("");
      setProjectId("");
      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      console.error(err);
      setError("Unable to create task.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
      <h2>Create Task</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Priority
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Deadline
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Assignee ID
          <input value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Assignee Name
          <input value={assigneeName} onChange={(e) => setAssigneeName(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Team ID
          <input value={teamId} onChange={(e) => setTeamId(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Project ID
          <input value={projectId} onChange={(e) => setProjectId(e.target.value)} required />
        </label>
      </div>
      <button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Task"}</button>
    </form>
  );
}
