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
        const validate = taskValidation.safeParse({
            title, description, status, priority
        });
        if (!validate.success) {
            const flattenError = validate.error.flatten((issue) => issue.message);
            res.status(400).json({
                error: flattenError.fieldErrors,
            });
            return;
        }
        const user = yield user_model_1.userModel.findById(userId);
        if (!user) {
            res.status(404).json({
                message: "User Not Found"
            });
            return;
        }
        const task = yield task_model_1.taskModel.create({
            title,
            description,
            status,
            priority,
            user: userId
        });
        res.status(201).json({
            message: "Task Created",
            task
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
        return;
    }
});
exports.createTask = createTask;
const getAllUserTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const tasks = yield task_model_1.taskModel.find({ user: userId });
        res.status(200).json({
            message: "User Tasks",
            tasks
        });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
        return;
    }
});
exports.getAllUserTask = getAllUserTask;
const updateTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        const { title, description, status, priority } = req.body;
        if (!taskId || !mongoose_1.default.Types.ObjectId.isValid(taskId)) {
            res.status(404).json({
                message: "Invalid Task Id"
            });
            return;
        }
        const task = yield task_model_1.taskModel.findById(taskId);
        if (!task) {
            res.status(404).json({
                message: "Task Not Found"
            });
            return;
        }
        if (((_a = task.user) === null || _a === void 0 ? void 0 : _a.toString()) !== userId.toString()) {
            res.status(400).json({
                message: "Forbidden"
            });
            return;
        }
        const updatedTask = yield task_model_1.taskModel.findByIdAndUpdate(taskId, {
            title,
            description,
            status,
            priority
        }, { new: true });
        res.status(200).json({
            message: "Task Updated",
            task: updatedTask
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
        return;
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        if (!taskId || !mongoose_1.default.Types.ObjectId.isValid(taskId)) {
            res.status(400).json({
                message: "Invalid Task Id",
            });
            return;
        }
        const task = yield task_model_1.taskModel.findById(taskId);
        if (!task) {
            res.status(404).json({
                message: "Task Not Found"
            });
            return;
        }
        if (((_a = task.user) === null || _a === void 0 ? void 0 : _a.toString()) !== userId.toString()) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }
        yield task_model_1.taskModel.findByIdAndDelete(taskId);
        res.status(200).json({
            message: "Task Deleted"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
        return;
    }
});
exports.deleteTask = deleteTask;
