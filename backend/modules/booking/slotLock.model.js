import mongoose from "mongoose";

const slotLockSchema = new mongoose.Schema({
    caregiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Caregiver",
        required: true,
        index: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } 
    }
}, { timestamps: true });

// Prevent overlapping exact locks
slotLockSchema.index({ caregiverId: 1, bookingDate: 1, startTime: 1, endTime: 1 }, { unique: true });

export default mongoose.model("SlotLock", slotLockSchema);
