import { Request, Response, NextFunction } from "express";
import { userModel } from "../models/user.model";

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            res.status(404).json({
                message: "Invalid User Id"
            })
        }

        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            res.status(404).json({
                message: "User Not Found",
            })
        }

        res.status(200).json({
            message: "User Found",
            user
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}