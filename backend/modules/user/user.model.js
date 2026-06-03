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
            index: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        password: {
            type: String,
            required: function () {
                return this.authProvider === "local";
            },
            select: false
        },

        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local"
        },

        role: {
            type: String,
            enum: ["user", "admin", "caregiver"],
            default: "user",
            index: true,
        },

        profileImage: {
            type: String,
            default: "",
        }, 
        
        failedLoginAttempts: {
            type: Number,
            default: 0,
        },

        lockUntil: {
            type: Date,
            default: null,
        },

        isApproved: {
            type: Boolean,
            default: function() {
                return this.role !== "caregiver";
            },
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: function() {
                return this.role === "caregiver" ? "pending" : "approved";
            },
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);