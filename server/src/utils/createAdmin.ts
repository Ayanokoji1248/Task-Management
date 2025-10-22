import dotenv from "dotenv";

dotenv.config()
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { userModel } from "../models/user.model";


async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);

        const hashedPassword = await bcrypt.hash("admin", 10);

        const admin = await userModel.create({
            username: "admin",
            email: "krishAdmin12@gmail.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created:", admin);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createAdmin();
