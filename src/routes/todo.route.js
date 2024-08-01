const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todo.controller");

router.post("/", async (req, res, next) => {
  try {
    req.body.userId = req.user._id;
    const todo = await todoController.createTodo(req.body);
    res.status(201).json({ message: "Todo create successfully", data: todo });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const todo = await todoController.updateTodo(
      { ...req.body, userId: req.user._id, role: req.user.role },
      req.params.id
    );
    res.status(200).json({ message: "Todo updated successfully", data: todo });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await todoController.deleteTodo(
      { userId: req.user._id, role: req.user.role },
      req.params.id
    );
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const todos = await todoController.getAllTodos(req.user);
    res.status(200).json({ data: todos });
  } catch (error) {
    next(error);
  }
});

router.get("/filter", async (req, res, next) => {
  try {
    const todos = await todoController.getAllTodosByFilter(req.query);
    res.status(200).json({ data: todos });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const todo = await todoController.getTodoById(req.params.id);
    res.status(200).json({ data: todo });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
