import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { verifyUser } from "../middlewares/verify.js";

const router = express.Router();

router.post("/", verifyUser, createTask);
router.get("/", verifyUser, getTasks);
router.put("/:id", verifyUser, updateTask);
router.delete("/:id", verifyUser, deleteTask);

export default router;
