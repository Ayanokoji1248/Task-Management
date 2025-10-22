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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogs = void 0;
const log_model_1 = require("../models/log.model");
const getLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("HERE");
        const { userId, event_type } = req.query;
        // Build query
        const query = {};
        if (userId)
            query.userId = userId;
        if (event_type)
            query.event_type = event_type;
        const logs = yield log_model_1.logModel
            .find(query)
            .populate("userId", "username email role") // Get user info
            .sort({ createdAt: -1 });
        const total = yield log_model_1.logModel.countDocuments(query);
        res.status(200).json({
            total,
            logs
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getLogs = getLogs;
