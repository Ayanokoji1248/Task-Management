import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload;
        }
    }
}

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Token Required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        const role = (decoded as any).role;
        console.log(role)
        if (!role || role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        // attach user info to request
        req.user = decoded;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid Token" });
    }
};
