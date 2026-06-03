import mongoose from "mongoose";

const caregiverAvailabilitySchema = new mongoose.Schema(
    {
        caregiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Caregiver",
            required: true,
            index: true,
        },

        dayOfWeek: {
            type: Number,
            required: true,
            min: 0,
            max: 6,
        },

        /** HH:MM in 24-hour format */
        startTime: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):[0-5]\d$/,
        },

        /** HH:MM in 24-hour format */
        endTime: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):[0-5]\d$/,
        },

        slotDuration: {
            type: Number,
            required: true,
            default: 60,
            min: 15,
            max: 480,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Compound index for efficient queries
caregiverAvailabilitySchema.index({ caregiverId: 1, dayOfWeek: 1 });

export default mongoose.model("CaregiverAvailability", caregiverAvailabilitySchema);
