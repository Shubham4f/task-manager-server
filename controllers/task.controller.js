import Task from "../models/task.model.js";
import { errorHandler } from "../utils/error.js";

export const createTask = async (req, res, next) => {
  try {
    const { task } = req.body;
    const user_id = req.user.id;
    const newTask = new Task({ user_id, task });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    return next(errorHandler(500, "Failed to create task"));
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user_id: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    return next(errorHandler(500, "Failed to fetch tasks"));
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { task, isCompleted } = req.body;
    const existingTask = await Task.findOne({ _id: id, user_id: req.user.id });
    if (!existingTask)
      return next(errorHandler(404, "Task not found or unauthorized"));
    if (task !== undefined) existingTask.task = task;
    if (isCompleted !== undefined) existingTask.isCompleted = isCompleted;
    await existingTask.save();
    res.status(200).json(existingTask);
  } catch (error) {
    return next(errorHandler(500, "Failed to update task"));
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      user_id: req.user.id,
    });
    if (!deletedTask)
      return next(errorHandler(404, "Task not found or unauthorized"));
    res.status(200).json(deletedTask);
  } catch (error) {
    return next(errorHandler(500, "Failed to delete task"));
  }
};
