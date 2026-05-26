import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: [
                "personal-care",
                "medical-care",
                "companionship",
                "household-help",
                "specialized-care",
                "emergency-care",
            ],
        },
        icon: {
            type: String,
            default: "",
        },
        basePrice: {
            type: Number,
            required: true,
            min: 0,
        },
        duration: {
            type: Number, // in hours
            required: true,
            min: 1,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        features: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Service", serviceSchema);
