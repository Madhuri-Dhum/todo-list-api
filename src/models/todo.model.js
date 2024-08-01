const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      require: true,
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("todos", todoSchema);

module.exports = Todo;
