import React, { useState } from "react";
import api from "../api.js";

export default function CreateProjectForm({ onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamId, setTeamId] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!name || !teamId) {
      setError("Name and team ID are required.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/projects", { name, description, teamId });
      setName("");
      setDescription("");
      setTeamId("");
      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      console.error(err);
      setError("Unable to create project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
      <h2>Create Project</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
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
          Team ID
          <input value={teamId} onChange={(e) => setTeamId(e.target.value)} required />
        </label>
      </div>
      <button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Project"}</button>
    </form>
  );
}
