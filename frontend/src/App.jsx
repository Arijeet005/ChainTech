import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import {
  completeTask,
  createTask,
  deleteTask,
  fetchTasks,
  updateTask
} from "./api/client.js";

function getErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong. Please try again."
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    return { total, completed, pending: total - completed };
  }, [tasks]);

  async function refresh() {
    setError("");
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate({ title, description }) {
    setError("");
    try {
      const created = await createTask({ title, description });
      setTasks((prev) => [created, ...prev]);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }

  async function handleUpdate(id, payload) {
    setError("");
    try {
      const updated = await updateTask(id, payload);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }

  async function handleComplete(id) {
    setError("");
    try {
      const updated = await completeTask(id);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="title">To-Do List</h1>
          <p className="subtitle">
            Total: {counts.total} · Pending: {counts.pending} · Completed:{" "}
            {counts.completed}
          </p>
        </div>
        <div className="muted" style={{ fontSize: 13 }}>
          API: {import.meta.env.VITE_API_URL || "http://localhost:5000"}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <TaskForm onCreate={handleCreate} />
        {error ? <div className="error">{error}</div> : null}
      </div>

      <div className="card">
        <TaskList
          tasks={tasks}
          loading={loading}
          onComplete={handleComplete}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onRetry={refresh}
        />
      </div>
    </div>
  );
}

