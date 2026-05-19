import React, { useEffect, useState } from "react";
import api from "../api.js";
import CreateProjectForm from "../components/CreateProjectForm.jsx";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/projects");
      setProjects(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div>
      <h1>Projects</h1>
      <CreateProjectForm onCreated={loadProjects} />

      {loading && <p>Loading projects...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && projects.length === 0 && <p>No projects found.</p>}

      <div>
        {projects.map((project) => (
          <div key={project.projectId} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "12px" }}>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <p><strong>Team:</strong> {project.teamId}</p>
            <p><strong>Created by:</strong> {project.createdBy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
