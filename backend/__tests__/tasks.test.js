jest.mock("../models/Task", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findById: jest.fn()
}));

const request = require("supertest");
const Task = require("../models/Task");
const app = require("../app");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Tasks API", () => {
  test("creates a task with category and no due date", async () => {
    Task.create.mockResolvedValueOnce({
      _id: "t1",
      title: "Buy milk",
      description: "2 liters",
      category: "shopping",
      dueDate: null,
      completed: false
    });

    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Buy milk", description: "2 liters", category: "Shopping" })
      .expect(201);

    expect(Task.create).toHaveBeenCalledWith({
      title: "Buy milk",
      description: "2 liters",
      category: "shopping"
    });
    expect(res.body.category).toBe("shopping");
    expect(res.body.dueDate).toBeNull();
  });

  test("rejects missing category", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "No category" })
      .expect(400);

    expect(res.body.message).toBe("Category must not be empty");
    expect(Task.create).not.toHaveBeenCalled();
  });

  test("creates a task with normalized category and due date", async () => {
    const dueDateIso = "2030-01-02T10:00:00.000Z";
    const expectedDate = new Date(dueDateIso);

    Task.create.mockResolvedValueOnce({
      _id: "t2",
      title: "Taxes",
      description: "",
      category: "work",
      dueDate: expectedDate,
      completed: false
    });

    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Taxes", category: "Work", dueDate: dueDateIso })
      .expect(201);

    expect(Task.create).toHaveBeenCalledWith({
      title: "Taxes",
      description: "",
      category: "work",
      dueDate: expectedDate
    });
    expect(res.body.category).toBe("work");
    expect(new Date(res.body.dueDate).toISOString()).toBe(dueDateIso);
  });

  test("rejects invalid due date", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Bad date", category: "Work", dueDate: "not-a-date" })
      .expect(400);

    expect(res.body.message).toBe("Invalid due date");
    expect(Task.create).not.toHaveBeenCalled();
  });

  test("accepts date-only dueDate (stored at noon UTC)", async () => {
    const expectedDate = new Date(Date.UTC(2030, 0, 2, 12, 0, 0, 0));

    Task.create.mockResolvedValueOnce({
      _id: "t3",
      title: "Date only",
      description: "",
      category: "general",
      dueDate: expectedDate,
      completed: false
    });

    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Date only", category: "Work", dueDate: "2030-01-02" })
      .expect(201);

    expect(Task.create).toHaveBeenCalledWith({
      title: "Date only",
      description: "",
      category: "work",
      dueDate: expectedDate
    });
    expect(new Date(res.body.dueDate).toISOString()).toBe(
      "2030-01-02T12:00:00.000Z"
    );
  });

  test("filters tasks by category", async () => {
    const sort = jest.fn().mockResolvedValueOnce([
      { _id: "a", title: "A", category: "work" },
      { _id: "c", title: "C", category: "work" }
    ]);
    Task.find.mockReturnValueOnce({ sort });

    const res = await request(app).get("/api/tasks?category=Work").expect(200);

    expect(Task.find).toHaveBeenCalledWith({ category: "work" });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(res.body).toHaveLength(2);
    expect(res.body.every((t) => t.category === "work")).toBe(true);
  });

  test("updates category and clears due date", async () => {
    Task.findByIdAndUpdate.mockResolvedValueOnce({
      _id: "t4",
      title: "Plan",
      description: "",
      category: "personal",
      dueDate: null,
      completed: false
    });

    const res = await request(app)
      .put("/api/tasks/t4")
      .send({ category: "Personal", dueDate: null })
      .expect(200);

    expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
      "t4",
      { category: "personal", dueDate: null },
      { new: true, runValidators: true }
    );
    expect(res.body.category).toBe("personal");
    expect(res.body.dueDate).toBeNull();
  });

  test("rejects update with empty category", async () => {
    const res = await request(app)
      .put("/api/tasks/t5")
      .send({ category: "   " })
      .expect(400);

    expect(res.body.message).toBe("Category must not be empty");
    expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
  });
});
