import mongoose from "mongoose";
import { schemaOptions } from "./_schema.js";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        phone: { type: String, required: true },
        password: { type: String, required: true, minlength: 6, select: false },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
            index: true,
        },
    },
    schemaOptions,
);

export default mongoose.model("User", userSchema);