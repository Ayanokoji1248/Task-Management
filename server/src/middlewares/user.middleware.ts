import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload;
        }
    }
}

export const userMiddlware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({
                message: "Token Required"
            })
            return
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = decoded

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: "Invalid Token"
        })
        return
    }
}