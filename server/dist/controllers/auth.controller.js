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
exports.userLogout = exports.userLogin = exports.userRegister = void 0;
const zod_1 = require("zod");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helper_1 = require("../utils/helper");
const userRegisterSchema = zod_1.z.object({
    username: zod_1.z.string().trim().min(5, "At least 5 character long"),
    email: zod_1.z.string().trim().email({ message: "Invalid Email format" }),
    password: zod_1.z.string().trim().min(5, "Password should at least 5 characters long")
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
            res.status(400).json({ errors: flattenError.fieldErrors });
            yield (0, helper_1.logEvent)(req, null, "registration_failed", 3, "Validation Error");
            return;
        }
        const userExist = yield user_model_1.userModel.findOne({ email });
        if (userExist) {
            res.status(400).json({ message: "Email Already Exists" });
            yield (0, helper_1.logEvent)(req, null, "registration_failed", 3, "Email Already Exists");
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield user_model_1.userModel.create({ username, email, password: hashedPassword });
        if (!user) {
            res.status(400).json({ message: "Error Creating User" });
            yield (0, helper_1.logEvent)(req, null, "registration_failed", 4, "Error creating user in DB");
            return;
        }
        const _a = user.toObject(), { password: _ } = _a, sanitizeUser = __rest(_a, ["password"]);
        const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET);
        res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
        res.status(201).json({ message: "User Created", user: sanitizeUser });
        yield (0, helper_1.logEvent)(req, user._id.toString(), "registration_success", 1, "User registered successfully");
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
        yield (0, helper_1.logEvent)(req, null, "registration_failed", 5, "Internal Server Error during registration");
    }
});
exports.userRegister = userRegister;
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const validate = userLoginSchema.safeParse({ email, password });
        if (!validate.success) {
            const flattenError = validate.error.flatten((issue) => issue.message);
            res.status(400).json({ error: flattenError.fieldErrors });
            return;
        }
        const userExist = yield user_model_1.userModel.findOne({ email });
        if (!userExist) {
            res.status(400).json({ message: "User Not Found" });
            yield (0, helper_1.logEvent)(req, null, "login_failed", 3, `Login attempt failed for email: ${email}`);
            return;
        }
        const passwordIsValid = yield bcrypt_1.default.compare(password, userExist.password);
        if (!passwordIsValid) {
            res.status(401).json({ message: "Invalid Credentials" });
            yield (0, helper_1.logEvent)(req, userExist._id.toString(), "login_failed", 3, "Incorrect password");
            return;
        }
        const _a = userExist.toObject(), { password: _ } = _a, sanitizeUser = __rest(_a, ["password"]);
        const token = jsonwebtoken_1.default.sign({ id: userExist._id, username: userExist.username, role: userExist.role }, process.env.JWT_SECRET);
        res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
        res.status(200).json({ message: "Login Successful", user: sanitizeUser });
        yield (0, helper_1.logEvent)(req, userExist._id.toString(), "login_success", 1, "User logged in successfully");
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
        yield (0, helper_1.logEvent)(req, null, "login_failed", 5, "Internal Server Error during login");
    }
});
exports.userLogin = userLogin;
const userLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(404).json({ message: "Token Required" });
            return;
        }
        res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
        res.status(200).json({ message: "User Logout" });
        // Log the logout event (userId is optional here, could decode token if needed)
        yield (0, helper_1.logEvent)(req, ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null, "logout", 1, "User logged out successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        yield (0, helper_1.logEvent)(req, ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || null, "logout_failed", 5, "Internal Server Error during logout");
    }
});
exports.userLogout = userLogout;
