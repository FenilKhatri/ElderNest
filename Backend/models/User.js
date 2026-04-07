import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        phone: {
            type: String,
            trim: true,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        profileImage: {
            type: String,
            default: "",
        },

        age: {
            type: Number,
            min: 0,
        },

        emergencyContact: {
            name: { type: String, trim: true },
            phone: { type: String, trim: true },
            relation: { type: String, trim: true },
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);