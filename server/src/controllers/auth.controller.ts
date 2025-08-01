import { Request, Response, NextFunction } from "express";

import { z } from "zod"
import { userModel } from "../models/user.model";
import bcrypt from "bcrypt";

const userRegisterSchema = z.object({
    username: z.string().trim().min(5, "At least 5 character long"),
    email: z.string().trim().email({ message: "Invalid Email format" }),
    password: z.string().trim().min(5, "Password should atleast 5 character long")
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