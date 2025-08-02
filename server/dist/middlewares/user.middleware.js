"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddlware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddlware = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({
                message: "Token Required"
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            message: "Invalid Token"
        });
        return;
    }
};
exports.userMiddlware = userMiddlware;
