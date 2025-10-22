"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const log_controller_1 = require("../controllers/log.controller");
const admin_middleware_1 = require("../middlewares/admin.middleware");
const logRouter = express_1.default.Router();
// Only admins can see logs
logRouter.get("/", admin_middleware_1.adminMiddleware, log_controller_1.getLogs);
exports.default = logRouter;
