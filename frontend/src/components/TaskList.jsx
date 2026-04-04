import React from "react";
import TaskItem from "./TaskItem.jsx";

export default function TaskList({
  tasks,
  loading,
  onComplete,
  onDelete,
  onUpdate,
  onRetry
}) {
  if (loading) {
    return <div className="muted">Loading tasks...</div>;
  }

  if (!tasks.length) {
    return (
      <div>
        <div className="muted">No tasks yet. Add your first task above.</div>
        <button className="btn" onClick={onRetry} style={{ marginTop: 12 }}>
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

