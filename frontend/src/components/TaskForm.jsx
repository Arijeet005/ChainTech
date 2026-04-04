import React, { useState } from "react";

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
      await onCreate({ title: trimmedTitle, description });
      setTitle("");
      setDescription("");
    } catch {
      // parent shows error
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="row">
        <div style={{ flex: "1 1 260px" }}>
          <input
            className="input"
            placeholder="Task title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />
        </div>
        <div style={{ flex: "2 1 360px" }}>
          <input
            className="input"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
          />
        </div>
        <div>
          <button className="btn btnPrimary" type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Task"}
          </button>
        </div>
      </div>
      {localError ? <div className="error">{localError}</div> : null}
    </form>
  );
}

