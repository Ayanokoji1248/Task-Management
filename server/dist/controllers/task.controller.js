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
exports.createTask = void 0;
const zod_1 = __importDefault(require("zod"));
const user_model_1 = require("../models/user.model");
const task_model_1 = require("../models/task.model");
const taskValidation = zod_1.default.object({
    title: zod_1.default.string().trim(),
    description: zod_1.default.string().trim(),
    status: zod_1.default.enum(["In Progress", "Completed", "To Do"]),
    priority: zod_1.default.enum(["Low", "Medium", "High"]),
});
const createTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
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
