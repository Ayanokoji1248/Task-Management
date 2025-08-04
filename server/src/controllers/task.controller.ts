import { Request, Response, NextFunction } from "express"
import z from "zod";
import { userModel } from "../models/user.model";
import { taskModel } from "../models/task.model";

const taskValidation = z.object({
    title: z.string().trim(),
    description: z.string().trim(),
    status: z.enum(["In Progress", "Completed", "To Do"]),
    priority: z.enum(["Low", "Medium", "High"]),
})

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const { title, description, status, priority } = req.body

        const validate = taskValidation.safeParse({
            title, description, status, priority
        });

        if (!validate.success) {
            const flattenError = validate.error.flatten((issue) => issue.message);
            res.status(400).json({
                error: flattenError.fieldErrors,
            })
            return
        }

        const user = await userModel.findById(userId);

        if (!user) {
            res.status(404).json({
                message: "User Not Found"
            })
            return
        }

        const task = await taskModel.create({
            title,
            description,
            status,
            priority,
            user: userId
        })

        res.status(201).json({
            message: "Task Created",
            task
        })


    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
        return
    }
}

export const getAllUserTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;

        const tasks = await taskModel.find({ user: userId });

        res.status(200).json({
            message: "User Tasks",
            tasks
        })
        return

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
        return
    }
}