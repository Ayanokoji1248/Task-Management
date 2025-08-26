import mongoose, { model, Schema } from "mongoose";

const logSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    event_type: {
        type: String,
        required: true
    },
    severity: {
        type: Number,
        min: 1,
        max: 5,
        default: 1,
        required: true
    },
    ip: String,
    details: {
        type:String,
        default:""
    },
}, { timestamps: true })


export const logModel = model("log", logSchema);
