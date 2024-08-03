const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  title_subtask: String,
  description: String,
});

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  subtasks: [subtaskSchema],
});

module.exports = mongoose.model("Todo", todoSchema);
