"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Token Required" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const role = decoded.role;
        console.log(role);
        if (!role || role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        // attach user info to request
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid Token" });
    }
};
exports.adminMiddleware = adminMiddleware;
