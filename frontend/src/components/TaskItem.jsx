import React, { useMemo, useState } from "react";
import {
  DEFAULT_CATEGORIES,
  categoryTextColorClass,
  formatCategoryLabel,
  normalizeCategory
} from "../constants/taskCategories.js";

export default function TaskItem({ task, onComplete, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  const initialCategory = useMemo(() => {
    const normalized = normalizeCategory(task.category);
    const match = DEFAULT_CATEGORIES.find((c) => normalizeCategory(c) === normalized);
    if (match) {
      return { selected: match, custom: "" };
    }
    return { selected: "Custom", custom: task.category || "" };
  }, [task.category]);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory.selected);
  const [customCategory, setCustomCategory] = useState(initialCategory.custom);
  const [dueDate, setDueDate] = useState(() => {
    try {
      return task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "";
    } catch {
      return "";
    }
  });
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState("");

  const created = useMemo(() => {
    try {
      return new Date(task.createdAt).toLocaleString();
    } catch {
      return "";
    }
  }, [task.createdAt]);

  const dueLabel = useMemo(() => {
    if (!task.dueDate) return "";
    try {
      return new Date(task.dueDate).toLocaleDateString();
    } catch {
      return "";
    }
  }, [task.dueDate]);

  async function save() {
    setLocalError("");
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setLocalError("Title must not be empty");
      return;
    }

    const finalCategory =
      selectedCategory === "Custom" ? customCategory.trim() : selectedCategory;
    if (!finalCategory) {
      setLocalError("Category must not be empty");
      return;
    }

    setSaving(true);
    try {
      await onUpdate(task._id, {
        title: trimmedTitle,
        description,
        category: finalCategory,
        dueDate: dueDate || null
      });
      setEditing(false);
    } catch {
      // parent shows error
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="rounded-xl border border-gray-700 bg-gray-800 p-4 transition-colors hover:border-gray-600"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex flex-col gap-3">
              <input
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saving}
              />
              <input
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={saving}
                placeholder="Description"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-16">
                <div className="sm:col-span-6">
                  <select
                    className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={saving}
                  >
                    {DEFAULT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <input
                  className="sm:col-span-6 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={saving}
                />
              </div>
              {selectedCategory === "Custom" ? (
                <input
                  className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  disabled={saving}
                  placeholder="Custom category"
                />
              ) : null}
              {localError ? (
                <div className="text-sm text-red-400">{localError}</div>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <button
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={save}
                  disabled={saving}
                  type="button"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm font-semibold text-gray-100 hover:border-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => {
                    setEditing(false);
                    setTitle(task.title);
                    setDescription(task.description || "");
                    setSelectedCategory(initialCategory.selected);
                    setCustomCategory(initialCategory.custom);
                    try {
                      setDueDate(
                        task.dueDate
                          ? new Date(task.dueDate).toISOString().slice(0, 10)
                          : ""
                      );
                    } catch {
                      setDueDate("");
                    }
                    setLocalError("");
                  }}
                  disabled={saving}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className={`min-w-0 truncate text-base font-semibold ${
                    task.completed ? "line-through text-gray-400" : "text-gray-100"
                  }`}
                >
                  {task.title}
                </div>
                {task.completed ? (
                  <span
                    className="rounded-full border border-emerald-600/40 bg-emerald-600/10 px-2 py-0.5 text-xs font-semibold text-emerald-300"
                  >
                    Completed
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">
                    Pending
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`bg-gray-700 px-2 py-1 rounded-md text-sm ${categoryTextColorClass(
                    task.category
                  )}`}
                >
                  {formatCategoryLabel(task.category)}
                </span>
                {dueLabel ? (
                  <span className="text-xs text-gray-400">
                    Due: {dueLabel}
                  </span>
                ) : null}
              </div>
              {task.description ? (
                <div className="mt-2 text-sm text-gray-300">
                  {task.description}
                </div>
              ) : null}
              <div className="mt-3 text-xs text-gray-500">
                Created: {created}
              </div>
            </div>
          )}
        </div>

        {!editing ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="inline-flex h-10 min-w-[96px] items-center justify-center rounded-md border border-gray-700 bg-gray-900 px-3 text-sm font-semibold text-gray-100 hover:border-gray-600"
              onClick={() => setEditing(true)}
              type="button"
            >
              Edit
            </button>
            <button
              className="inline-flex h-10 min-w-[96px] items-center justify-center rounded-md border border-gray-700 bg-gray-900 px-3 text-sm font-semibold text-gray-100 hover:border-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => onComplete(task._id)}
              disabled={task.completed}
              type="button"
            >
              Complete
            </button>
            <button
              className="inline-flex h-10 min-w-[96px] items-center justify-center rounded-md bg-red-600 px-3 text-sm font-semibold text-white hover:bg-red-500"
              onClick={() => onDelete(task._id)}
              type="button"
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
