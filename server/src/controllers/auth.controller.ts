import { Request, Response, NextFunction } from "express";

import { z } from "zod"
import { userModel } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRegisterSchema = z.object({
    username: z.string().trim().min(5, "At least 5 character long"),
    email: z.string().trim().email({ message: "Invalid Email format" }),
    password: z.string().trim().min(5, "Password should atleast 5 character long")
})

const userLoginSchema = userRegisterSchema.pick({
    email: true,
    password: true
})


export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;

        const validate = userRegisterSchema.safeParse({ username, email, password });

        if (!validate.success) {
            const flattenError = validate.error.flatten((issue) => issue.message)
            res.status(400).json({
                "errors": flattenError.fieldErrors,
            })
            return
        }

        const userExist = await userModel.findOne({ email });

        if (userExist) {
            res.status(400).json({
                message: "Email Already Exists"
            })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        })

        if (!user) {
            res.status(400).json({
                message: "Error Creating User"
            })
            return
        }

        const { password: _, ...sanitizeUser } = user.toObject()

        const token = jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET as string);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: true
        })

        res.status(201).json({
            message: "User Created",
            user: sanitizeUser,
        })
        return

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, password } = req.body;
        const validate = userLoginSchema.safeParse({ email, password });

        if (!validate.success) {
            const flattenError = validate.error.flatten((issue) => issue.message)
            res.status(400).json({
                error: flattenError.fieldErrors,
            })
            return
        }

        const userExist = await userModel.findOne({ email });

        if (!userExist) {
            res.status(400).json({
                message: "User Not Found"
            })
            return;
        }

        const passwordIsValid = await bcrypt.compare(password, userExist?.password)

        if (!passwordIsValid) {
            res.status(401).json({
                message: "Invalid Credentials",
            })
            return
        }

        const { password: _, ...sanitizeUser } = userExist.toObject();

        const token = jwt.sign({ _id: userExist._id, username: userExist.username }, process.env.JWT_SECRET as string);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: true
        })

        res.status(200).json({
            message: "Login Successful",
            user: sanitizeUser,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
        })
    }
}