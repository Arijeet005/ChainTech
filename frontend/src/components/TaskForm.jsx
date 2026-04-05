import React, { useState } from "react";
import { DEFAULT_CATEGORIES } from "../constants/taskCategories.js";

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setLocalError("");

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setLocalError("Title must not be empty");
      return;
    }

    setSubmitting(true);
    try {
      const finalCategory =
        selectedCategory === "Custom" ? customCategory.trim() : selectedCategory;

      if (!finalCategory) {
        setLocalError("Category must not be empty");
        setSubmitting(false);
        return;
      }

      await onCreate({
        title: trimmedTitle,
        description,
        category: finalCategory,
        dueDate: dueDate || null
      });
      setTitle("");
      setDescription("");
      setSelectedCategory(DEFAULT_CATEGORIES[0]);
      setCustomCategory("");
      setDueDate("");
    } catch {
      // parent shows error
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-4">
            <input
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              placeholder="Task title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="md:col-span-4">
            <input
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="md:col-span-2">
            <select
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={submitting}
            >
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="Custom">Custom</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <input
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={submitting}
            />
          </div>
        </div>

        {selectedCategory === "Custom" ? (
          <input
            className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
            placeholder="Custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            disabled={submitting}
          />
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-gray-400">
            Category is required. Due date is optional.
          </div>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Adding..." : "Add Task"}
          </button>
        </div>
      </div>
      {localError ? (
        <div className="mt-3 text-sm text-red-400">{localError}</div>
      ) : null}
    </form>
  );
}
