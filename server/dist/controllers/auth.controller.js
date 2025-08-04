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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = exports.userRegister = void 0;
const zod_1 = require("zod");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRegisterSchema = zod_1.z.object({
    username: zod_1.z.string().trim().min(5, "At least 5 character long"),
    email: zod_1.z.string().trim().email({ message: "Invalid Email format" }),
    password: zod_1.z.string().trim().min(5, "Password should atleast 5 character long")
});
const userLoginSchema = userRegisterSchema.pick({
    email: true,
    password: true
});
const userRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const validate = userRegisterSchema.safeParse({ username, email, password });
        if (!validate.success) {
            const flattenError = validate.error.flatten((issue) => issue.message);
            res.status(400).json({
                "errors": flattenError.fieldErrors,
            });
            return;
        }
        const userExist = yield user_model_1.userModel.findOne({ email });
        if (userExist) {
            res.status(400).json({
                message: "Email Already Exists"
            });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield user_model_1.userModel.create({
            username,
            email,
            password: hashedPassword
        });
        if (!user) {
            res.status(400).json({
                message: "Error Creating User"
            });
            return;
        }
        const _a = user.toObject(), { password: _ } = _a, sanitizeUser = __rest(_a, ["password"]);
        const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: true
        });
        res.status(201).json({
            message: "User Created",
            user: sanitizeUser,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
exports.userRegister = userRegister;
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const validate = userLoginSchema.safeParse({ email, password });
        if (!validate.success) {
            const flattenError = validate.error.flatten((issue) => issue.message);
            res.status(400).json({
                error: flattenError.fieldErrors,
            });
            return;
        }
        const userExist = yield user_model_1.userModel.findOne({ email });
        if (!userExist) {
            res.status(400).json({
                message: "User Not Found"
            });
            return;
        }
        const passwordIsValid = yield bcrypt_1.default.compare(password, userExist === null || userExist === void 0 ? void 0 : userExist.password);
        if (!passwordIsValid) {
            res.status(401).json({
                message: "Invalid Credentials",
            });
            return;
        }
        const _a = userExist.toObject(), { password: _ } = _a, sanitizeUser = __rest(_a, ["password"]);
        const token = jsonwebtoken_1.default.sign({ id: userExist._id, username: userExist.username }, process.env.JWT_SECRET);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: true
        });
        res.status(200).json({
            message: "Login Successful",
            user: sanitizeUser,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.userLogin = userLogin;
