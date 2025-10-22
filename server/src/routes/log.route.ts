import express from "express";
import { getLogs } from "../controllers/log.controller";
import { adminMiddleware } from "../middlewares/admin.middleware";

const logRouter = express.Router();

// Only admins can see logs
logRouter.get("/", adminMiddleware, getLogs);

export default logRouter;
