import mongoose, { model, Schema } from "mongoose";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        requried: true
    },
    status: {
        type: String,
        enum: ["In Progress", "Completed", "To Do"],
        required: true,
        default: "To Do"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true,
        default: "Low"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, { timestamps: true })

export const taskModel = model("task", taskSchema);