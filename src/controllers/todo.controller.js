const TodoItem = require("../models/todo.model");
const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const { Readable } = require("stream");
const csvWriter = require("csv-writer").createObjectCsvWriter;

const createTodo = (todo) => {
  try {
    return TodoItem.create(todo);
  } catch (error) {
    throw error;
  }
};

const createTodos = (todos) => {
  try {
    return TodoItem.insertMany(todos);
  } catch (error) {
    throw error;
  }
};

const updateTodo = async (todo, todoId) => {
  try {
    const todoDetails = await getTodoById(todoId);

    if (todoDetails.userId._id != todo.userId && todo.role == "USER") {
      const error = new Error("Don't have access to delete data");
      error.statusCode = 403;
      throw error;
    }

    return TodoItem.findByIdAndUpdate(todoId, todo, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
};

const deleteTodo = async (todo, todoId) => {
  try {
    const todoDetails = await getTodoById(todoId);

    if (todoDetails.userId._id != todo.userId && todo.role == "USER") {
      const error = new Error("Don't have access to delete data");
      error.statusCode = 403;
      throw error;
    }

    return TodoItem.findByIdAndDelete({ _id: todoId });
  } catch (error) {
    throw error;
  }
};

const getAllTodos = async (user) => {
  try {
    let condition = {};

    if (user.role == "USER") {
      condition = { userId: user._id };
    }

    return TodoItem.find(condition).populate("userId", "name");
  } catch (error) {
    throw error;
  }
};

const getAllTodosByFilter = async (searchParams) => {
  try {
    if (!searchParams.status) {
      const error = new Error("Status is required");
      error.statusCode = 400;
      throw error;
    }

    return TodoItem.find({ status: searchParams.status }).populate(
      "userId",
      "name"
    );
  } catch (error) {
    throw error;
  }
};

const getTodoById = async (todoId) => {
  try {
    const todo = await TodoItem.findById(todoId).populate("userId", "name");

    if (!todo) {
      const error = new Error("Todo not found");
      error.statusCode = 404;
      throw error;
    }

    return todo;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTodo,
  updateTodo,
  deleteTodo,
  getAllTodos,
  getAllTodosByFilter,
  getTodoById,
  createTodos,
};
