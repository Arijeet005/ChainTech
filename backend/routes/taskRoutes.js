const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  completeTask
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.patch("/:id/complete", completeTask);
router.delete("/:id", deleteTask);

module.exports = router;

