import express from "express";
const app = express();

import dotenv from "dotenv"
dotenv.config()
import cookieParser = require("cookie-parser");
import authRouter from "./routes/auth.route";
import { dbConnection } from "./config/dbConnection.config";
import taskRouter from "./routes/task.route";
import cors from "cors";
import userRouter from "./routes/user.route";

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/task', taskRouter);
app.use('/api/user', userRouter);

async function main() {
    try {
        await dbConnection();
        app.listen(process.env.PORT as string || "3000", () => {
            console.log("Server running on port 3000");
        })
    } catch (error) {
        console.error(error)
    }
}

main()