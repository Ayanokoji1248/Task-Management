import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { userModel } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logEvent } from "../utils/helper";

const userRegisterSchema = z.object({
    username: z.string().trim().min(5, "At least 5 character long"),
    email: z.string().trim().email({ message: "Invalid Email format" }),
    password: z.string().trim().min(5, "Password should at least 5 characters long")
});

const userLoginSchema = userRegisterSchema.pick({
    email: true,
    password: true
});

export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;

        const validate = userRegisterSchema.safeParse({ username, email, password });
        if (!validate.success) {
            const flattenError = validate.error.flatten((issue) => issue.message);
            res.status(400).json({ errors: flattenError.fieldErrors });
            await logEvent(req, null, "registration_failed", 3, "Validation Error");
            return;
        }

        const userExist = await userModel.findOne({ email });
        if (userExist) {
            res.status(400).json({ message: "Email Already Exists" });
            await logEvent(req, null, "registration_failed", 3, "Email Already Exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({ username, email, password: hashedPassword });

        if (!user) {
            res.status(400).json({ message: "Error Creating User" });
            await logEvent(req, null, "registration_failed", 4, "Error creating user in DB");
            return;
        }

        const { password: _, ...sanitizeUser } = user.toObject();
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET as string);

        res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
        res.status(201).json({ message: "User Created", user: sanitizeUser });

        await logEvent(req, user._id.toString(), "registration_success", 1, "User registered successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
        await logEvent(req, null, "registration_failed", 5, "Internal Server Error during registration");
    }
};

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const validate = userLoginSchema.safeParse({ email, password });
        if (!validate.success) {
            const flattenError = validate.error.flatten((issue) => issue.message);
            res.status(400).json({ error: flattenError.fieldErrors });
            return;
        }

        const userExist = await userModel.findOne({ email });
        if (!userExist) {
            res.status(400).json({ message: "User Not Found" });
            await logEvent(req, null, "login_failed", 3, `Login attempt failed for email: ${email}`);
            return;
        }

        const passwordIsValid = await bcrypt.compare(password, userExist.password);
        if (!passwordIsValid) {
            res.status(401).json({ message: "Invalid Credentials" });
            await logEvent(req, userExist._id.toString(), "login_failed", 3, "Incorrect password");
            return;
        }

        const { password: _, ...sanitizeUser } = userExist.toObject();
        const token = jwt.sign({ id: userExist._id, username: userExist.username, role: userExist.role }, process.env.JWT_SECRET as string);

        res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
        res.status(200).json({ message: "Login Successful", user: sanitizeUser });

        await logEvent(req, userExist._id.toString(), "login_success", 1, "User logged in successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
        await logEvent(req, null, "login_failed", 5, "Internal Server Error during login");
    }
};

export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(404).json({ message: "Token Required" });
            return;
        }

        res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
        res.status(200).json({ message: "User Logout" });

        // Log the logout event (userId is optional here, could decode token if needed)
        await logEvent(req, req.user?.id || null, "logout", 1, "User logged out successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        await logEvent(req, req.user?.id || null, "logout_failed", 5, "Internal Server Error during logout");
    }
};
