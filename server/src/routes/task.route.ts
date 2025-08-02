import { Router } from "express";
import { userMiddlware } from "../middlewares/user.middleware";
import { createTask } from "../controllers/task.controller";

const taskRouter = Router();

taskRouter.post("/create", userMiddlware, createTask)

export default taskRouter;