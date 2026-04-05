import React, { useEffect, useMemo, useState } from "react";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import {
  completeTask,
  createTask,
  deleteTask,
  fetchTasks,
  updateTask
} from "./api/client.js";
import { DEFAULT_CATEGORIES } from "./constants/taskCategories.js";

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
  const [categoryFilter, setCategoryFilter] = useState("All");

  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    return { total, completed, pending: total - completed };
  }, [tasks]);

  async function refresh(nextFilter) {
    setError("");
    setLoading(true);
    try {
      const filterToUse = nextFilter ?? categoryFilter;
      const data = await fetchTasks(filterToUse === "All" ? undefined : filterToUse);
      setTasks(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate({ title, description, category, dueDate }) {
    setError("");
    try {
      const created = await createTask({ title, description, category, dueDate });
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
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-4 px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">To-Do List</h1>
          <p className="mt-1 text-sm text-gray-400">
            Total: {counts.total} · Pending: {counts.pending} · Completed:{" "}
            {counts.completed}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="text-xs text-gray-500">
            API: {import.meta.env.VITE_API_URL || "http://localhost:5000"}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Filter</span>
            <select
              className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
              value={categoryFilter}
              onChange={(e) => {
                const next = e.target.value;
                setCategoryFilter(next);
                refresh(next);
              }}
            >
              <option value="All">All</option>
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-800 p-4">
        <TaskForm onCreate={handleCreate} />
        {error ? <div className="mt-3 text-sm text-red-400">{error}</div> : null}
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-800 p-4">
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

