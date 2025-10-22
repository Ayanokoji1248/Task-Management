"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getAllUserTask = exports.createTask = void 0;
const zod_1 = __importDefault(require("zod"));
const user_model_1 = require("../models/user.model");
const task_model_1 = require("../models/task.model");
const mongoose_1 = __importDefault(require("mongoose"));
const helper_1 = require("../utils/helper");
const taskValidation = zod_1.default.object({
    title: zod_1.default.string().trim(),
    description: zod_1.default.string().trim(),
    status: zod_1.default.enum(["In Progress", "Completed", "To Do"]),
    priority: zod_1.default.enum(["Low", "Medium", "High"]),
});
const createTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { title, description, status, priority } = req.body;
        const validate = taskValidation.safeParse({ title, description, status, priority });
        if (!validate.success) {
            const flattenError = validate.error.flatten((issue) => issue.message);
            return res.status(400).json({ error: flattenError.fieldErrors });
        }
        const user = yield user_model_1.userModel.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User Not Found" });
        const task = yield task_model_1.taskModel.create({ title, description, status, priority, user: userId });
        // Log the creation event
        yield (0, helper_1.logEvent)(req, userId, "create_task", 1, `Task created with ID: ${task._id}`);
        res.status(201).json({ message: "Task Created", task });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createTask = createTask;
const getAllUserTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const tasks = yield task_model_1.taskModel.find({ user: userId });
        // Optional: log that user viewed tasks
        yield (0, helper_1.logEvent)(req, userId, "view_tasks", 1, `Fetched all tasks for user`);
        res.status(200).json({ message: "User Tasks", tasks });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllUserTask = getAllUserTask;
const updateTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        const { title, description, status, priority } = req.body;
        if (!taskId || !mongoose_1.default.Types.ObjectId.isValid(taskId))
            return res.status(404).json({ message: "Invalid Task Id" });
        const task = yield task_model_1.taskModel.findById(taskId);
        if (!task)
            return res.status(404).json({ message: "Task Not Found" });
        if (((_a = task.user) === null || _a === void 0 ? void 0 : _a.toString()) !== userId.toString())
            return res.status(403).json({ message: "Forbidden" });
        const updatedTask = yield task_model_1.taskModel.findByIdAndUpdate(taskId, { title, description, status, priority }, { new: true });
        // Log the update event
        yield (0, helper_1.logEvent)(req, userId, "update_task", 2, `Task updated with ID: ${task._id}`);
        res.status(200).json({ message: "Task Updated", task: updatedTask });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        if (!taskId || !mongoose_1.default.Types.ObjectId.isValid(taskId))
            return res.status(400).json({ message: "Invalid Task Id" });
        const task = yield task_model_1.taskModel.findById(taskId);
        if (!task)
            return res.status(404).json({ message: "Task Not Found" });
        if (((_a = task.user) === null || _a === void 0 ? void 0 : _a.toString()) !== userId.toString())
            return res.status(401).json({ message: "Unauthorized" });
        yield task_model_1.taskModel.findByIdAndDelete(taskId);
        // Log the delete event
        yield (0, helper_1.logEvent)(req, userId, "delete_task", 3, `Task deleted with ID: ${task._id}`);
        res.status(200).json({ message: "Task Deleted" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteTask = deleteTask;
