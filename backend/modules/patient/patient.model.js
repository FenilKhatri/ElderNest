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
        dob: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true,
        },
        bloodGroup: {
            type: String,
            trim: true,
        },
        height: {
            type: String,
            trim: true,
        },
        weight: {
            type: String,
            trim: true,
        },
        primaryLanguage: {
            type: String,
            trim: true,
        },
        relationship: {
            type: String,
            trim: true,
            required: true,
        },
        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            pincode: { type: String, trim: true },
        },
        medicalConditions: {
            type: [String],
            default: [],
        },
        allergies: {
            type: [String],
            default: [],
        },
        currentMedications: {
            type: [String],
            default: [],
        },
        mobilityStatus: {
            type: String,
            trim: true,
            default: "Independent",
        },
        dietaryRestrictions: {
            type: String,
            trim: true,
        },
        chronicDiseases: {
            type: [String],
            default: [],
        },
        pastSurgeries: {
            type: [String],
            default: [],
        },
        primaryDoctor: {
            type: String,
            trim: true,
        },
        doctorContact: {
            type: String,
            trim: true,
        },
        insuranceProvider: {
            type: String,
            trim: true,
        },
        insuranceNumber: {
            type: String,
            trim: true,
        },
        notes: {
            type: String,
            trim: true,
        },
        emergencyContact: {
            contactName: { type: String, trim: true, required: true },
            relationship: { type: String, trim: true, required: true },
            primaryPhone: { type: String, trim: true, required: true },
            alternatePhone: { type: String, trim: true },
            email: { type: String, trim: true },
            address: { type: String, trim: true },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

patientSchema.virtual("age").get(function () {
    if (!this.dob) return null;
    const today = new Date();
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

patientSchema.index({ userId: 1, name: 1 });

export default mongoose.model("Patient", patientSchema);
