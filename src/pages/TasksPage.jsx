import React, { useEffect, useState } from "react";
import api from "../api.js";
import CreateTaskForm from "../components/CreateTaskForm.jsx";
import KanbanBoard from "../components/KanbanBoard.jsx";
import TaskDetailsModal from "../components/TaskDetailsModal.jsx";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/tasks");
      setTasks(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      await loadTasks();
    } catch (err) {
      console.error(err);
      setError("Unable to update task status.");
    }
  };

  return (
    <div>
      <h1>Tasks</h1>
      <CreateTaskForm onCreated={loadTasks} />

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && tasks.length === 0 && <p>No tasks found.</p>}

      <KanbanBoard tasks={tasks} onStatusChange={handleStatusUpdate} onSelectTask={setSelectedTask} />

      <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
}
