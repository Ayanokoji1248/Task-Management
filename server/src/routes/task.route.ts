import { Router } from "express";
import { userMiddlware } from "../middlewares/user.middleware";
import { createTask, getAllUserTask } from "../controllers/task.controller";

const taskRouter = Router();

taskRouter.post("/create", userMiddlware, createTask);

taskRouter.get('/all', userMiddlware, getAllUserTask)

export default taskRouter;