const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      default: "others",
      trim: true,
      lowercase: true,
      maxlength: [50, "Category must be 50 characters or less"]
    },
    dueDate: {
      type: Date,
      default: null
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

function ensureCategory(_doc, ret) {
  if (!ret.category) {
    ret.category = "others";
  }
  return ret;
}

taskSchema.set("toJSON", { transform: ensureCategory });
taskSchema.set("toObject", { transform: ensureCategory });

module.exports = mongoose.model("Task", taskSchema);
