const Task = require("../models/Task");
const asyncHandler = require("../middleware/asyncHandler");

function normalizeTitle(title) {
  if (typeof title !== "string") return "";
  return title.trim();
}

function normalizeCategory(category) {
  if (typeof category !== "string") return "";
  return category.trim().toLowerCase();
}

function normalizeDueDate(dueDate) {
  if (dueDate === undefined) return undefined;
  if (dueDate === null || dueDate === "") return null;

  if (typeof dueDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    const [yearStr, monthStr, dayStr] = dueDate.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);
    if (
      Number.isFinite(year) &&
      Number.isFinite(month) &&
      Number.isFinite(day) &&
      yearStr.length === 4
    ) {
      return new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
    }
  }

  const parsed = new Date(dueDate);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed;
}

exports.createTask = asyncHandler(async (req, res) => {
  const title = normalizeTitle(req.body?.title);
  const description =
    typeof req.body?.description === "string" ? req.body.description.trim() : "";
  const category = normalizeCategory(req.body?.category);
  const dueDate = normalizeDueDate(req.body?.dueDate);

  if (!title) {
    res.status(400);
    throw new Error("Title must not be empty");
  }

  if (!category) {
    res.status(400);
    throw new Error("Category must not be empty");
  }

  if (req.body?.dueDate !== undefined && dueDate === undefined) {
    res.status(400);
    throw new Error("Invalid due date");
  }

  const task = await Task.create({
    title,
    description,
    category,
    ...(dueDate === undefined ? {} : { dueDate })
  });
  res.status(201).json(task);
});

exports.getTasks = asyncHandler(async (req, res) => {
  const filter = {};
  if (typeof req.query?.category === "string" && req.query.category.trim()) {
    const normalized = normalizeCategory(req.query.category);
    if (normalized && normalized !== "all") {
      filter.category = normalized;
    }
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
});

exports.updateTask = asyncHandler(async (req, res) => {
  const title = req.body?.title;
  const description = req.body?.description;
  const category = req.body?.category;
  const dueDate = req.body?.dueDate;

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
  if (category !== undefined) {
    const normalized = normalizeCategory(category);
    if (!normalized) {
      res.status(400);
      throw new Error("Category must not be empty");
    }
    updates.category = normalized;
  }
  if (dueDate !== undefined) {
    const normalized = normalizeDueDate(dueDate);
    if (normalized === undefined) {
      res.status(400);
      throw new Error("Invalid due date");
    }
    updates.dueDate = normalized;
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
