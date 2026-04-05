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
    return <div className="text-sm text-gray-400">Loading tasks...</div>;
  }

  if (!tasks.length) {
    return (
      <div>
        <div className="text-sm text-gray-400">
          No tasks yet. Add your first task above.
        </div>
        <button
          className="mt-3 rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm font-semibold text-gray-100 hover:border-gray-600"
          onClick={onRetry}
          type="button"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
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
