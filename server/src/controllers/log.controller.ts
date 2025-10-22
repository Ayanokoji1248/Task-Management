import { Request, Response } from "express";
import { logModel } from "../models/log.model";

export const getLogs = async (req: Request, res: Response) => {
    try {
        console.log("HERE")
        const { userId, event_type} = req.query;

        // Build query
        const query: any = {};
        if (userId) query.userId = userId;
        if (event_type) query.event_type = event_type;

        const logs = await logModel
            .find(query)
            .populate("userId", "username email role") // Get user info
            .sort({ createdAt: -1 })

        const total = await logModel.countDocuments(query);

        res.status(200).json({
            total,
            logs
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
