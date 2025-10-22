import { Request, Response, NextFunction } from "express";
import z from "zod";
import { userModel } from "../models/user.model";
import { taskModel } from "../models/task.model";
import mongoose from "mongoose";
import { logEvent } from "../utils/helper";

const taskValidation = z.object({
    title: z.string().trim(),
    description: z.string().trim(),
    status: z.enum(["In Progress", "Completed", "To Do"]),
    priority: z.enum(["Low", "Medium", "High"]),
});

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const { title, description, status, priority } = req.body;

        const validate = taskValidation.safeParse({ title, description, status, priority });
        if (!validate.success) {
            const flattenError = validate.error.flatten((issue) => issue.message);
            return res.status(400).json({ error: flattenError.fieldErrors });
        }

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User Not Found" });

        const task = await taskModel.create({ title, description, status, priority, user: userId });

        // Log the creation event
        await logEvent(req, userId, "create_task", 1, `Task created with ID: ${task._id}`);

        res.status(201).json({ message: "Task Created", task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllUserTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const tasks = await taskModel.find({ user: userId });

        // Optional: log that user viewed tasks
        await logEvent(req, userId, "view_tasks", 1, `Fetched all tasks for user`);

        res.status(200).json({ message: "User Tasks", tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        const { title, description, status, priority } = req.body;

        if (!taskId || !mongoose.Types.ObjectId.isValid(taskId))
            return res.status(404).json({ message: "Invalid Task Id" });

        const task = await taskModel.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task Not Found" });
        if (task.user?.toString() !== userId.toString()) return res.status(403).json({ message: "Forbidden" });

        const updatedTask = await taskModel.findByIdAndUpdate(
            taskId,
            { title, description, status, priority },
            { new: true }
        );

        // Log the update event
        await logEvent(req, userId, "update_task", 2, `Task updated with ID: ${task._id}`);

        res.status(200).json({ message: "Task Updated", task: updatedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;

        if (!taskId || !mongoose.Types.ObjectId.isValid(taskId))
            return res.status(400).json({ message: "Invalid Task Id" });

        const task = await taskModel.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task Not Found" });
        if (task.user?.toString() !== userId.toString()) return res.status(401).json({ message: "Unauthorized" });

        await taskModel.findByIdAndDelete(taskId);

        // Log the delete event
        await logEvent(req, userId, "delete_task", 3, `Task deleted with ID: ${task._id}`);

        res.status(200).json({ message: "Task Deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
