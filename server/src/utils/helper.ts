import { Request } from "express";
import { logModel } from "../models/log.model";

export const logEvent = async(req:Request, userId:string|null, event_type:string, severity:number, details:string )=>{
    try {
        await logModel.create({
            userId,
            event_type,
            severity,
            ip:req.ip,
            details
        })
    } catch (error) {
        console.log("Error logging an event: ",error);
    }
}