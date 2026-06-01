import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
            min: 1,
            max: 150,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        medicalRequirements: {
            type: String,
            trim: true,
            default: "",
        },
        healthInformation: {
            type: String,
            trim: true,
            default: "",
        },
        emergencyContact: {
            name: { type: String, trim: true },
            phone: { type: String, trim: true },
            relation: { type: String, trim: true },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

patientSchema.index({ userId: 1, name: 1 });

export default mongoose.model("Patient", patientSchema);
