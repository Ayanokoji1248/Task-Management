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
exports.logEvent = void 0;
const log_model_1 = require("../models/log.model");
const logEvent = (req, userId, event_type, severity, details) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield log_model_1.logModel.create({
            userId,
            event_type,
            severity,
            ip: req.ip,
            details
        });
    }
    catch (error) {
        console.log("Error logging an event: ", error);
    }
});
exports.logEvent = logEvent;
