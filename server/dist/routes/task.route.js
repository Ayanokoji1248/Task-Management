"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_middleware_1 = require("../middlewares/user.middleware");
const task_controller_1 = require("../controllers/task.controller");
const taskRouter = (0, express_1.Router)();
taskRouter.post("/create", user_middleware_1.userMiddlware, task_controller_1.createTask);
exports.default = taskRouter;
