import { Router } from "express";
import { userMiddlware } from "../middlewares/user.middleware";
import { createTask, deleteTask, getAllUserTask, updateTask } from "../controllers/task.controller";

const taskRouter = Router();

taskRouter.post("/create", userMiddlware, createTask);

taskRouter.get('/all', userMiddlware, getAllUserTask);

taskRouter.put('/:id', userMiddlware, updateTask)

taskRouter.delete('/:id', userMiddlware, deleteTask);

export default taskRouter;