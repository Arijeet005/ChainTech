import React, { useMemo, useState } from "react";

export default function TaskItem({ task, onComplete, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState("");

  const created = useMemo(() => {
    try {
      return new Date(task.createdAt).toLocaleString();
    } catch {
      return "";
    }
  }, [task.createdAt]);

  async function save() {
    setLocalError("");
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setLocalError("Title must not be empty");
      return;
    }

    setSaving(true);
    try {
      await onUpdate(task._id, { title: trimmedTitle, description });
      setEditing(false);
    } catch {
      // parent shows error
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 12
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1 }}>
          {editing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saving}
              />
              <input
                className="input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={saving}
                placeholder="Description"
              />
              {localError ? <div className="error">{localError}</div> : null}
              <div className="row">
                <button
                  className="btn btnPrimary"
                  onClick={save}
                  disabled={saving}
                  type="button"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setEditing(false);
                    setTitle(task.title);
                    setDescription(task.description || "");
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
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    fontWeight: 700,
                    textDecoration: task.completed ? "line-through" : "none"
                  }}
                >
                  {task.title}
                </div>
                {task.completed ? (
                  <span
                    style={{
                      fontSize: 12,
                      padding: "2px 8px",
                      borderRadius: 999,
                      border: "1px solid #10b981",
                      color: "#065f46",
                      background: "#ecfdf5"
                    }}
                  >
                    Completed
                  </span>
                ) : (
                  <span className="muted" style={{ fontSize: 12 }}>
                    Pending
                  </span>
                )}
              </div>
              {task.description ? (
                <div className="muted" style={{ marginTop: 6 }}>
                  {task.description}
                </div>
              ) : null}
              <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
                Created: {created}
              </div>
            </div>
          )}
        </div>

        {!editing ? (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <button
              className="btn"
              onClick={() => setEditing(true)}
              type="button"
            >
              Edit
            </button>
            <button
              className="btn"
              onClick={() => onComplete(task._id)}
              disabled={task.completed}
              type="button"
            >
              Complete
            </button>
            <button
              className="btn btnDanger"
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

