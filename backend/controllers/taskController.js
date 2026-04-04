const Task = require("../models/Task");
const asyncHandler = require("../middleware/asyncHandler");

function normalizeTitle(title) {
  if (typeof title !== "string") return "";
  return title.trim();
}

exports.createTask = asyncHandler(async (req, res) => {
  const title = normalizeTitle(req.body?.title);
  const description =
    typeof req.body?.description === "string" ? req.body.description.trim() : "";

  if (!title) {
    res.status(400);
    throw new Error("Title must not be empty");
  }

  const task = await Task.create({ title, description });
  res.status(201).json(task);
});

exports.getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

exports.updateTask = asyncHandler(async (req, res) => {
  const title = req.body?.title;
  const description = req.body?.description;

  const updates = {};
  if (title !== undefined) {
    const normalized = normalizeTitle(title);
    if (!normalized) {
      res.status(400);
      throw new Error("Title must not be empty");
    }
    updates.title = normalized;
  }
  if (description !== undefined) {
    updates.description = typeof description === "string" ? description.trim() : "";
  }

  if (Object.keys(updates).length === 0) {
    res.status(400);
    throw new Error("Nothing to update");
  }

  const task = await Task.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.json(task);
});

exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  res.json({ message: "Task deleted" });
});

exports.completeTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.completed) {
    res.status(400);
    throw new Error("Task is already completed");
  }

  task.completed = true;
  await task.save();

  res.json(task);
});

