import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        caregiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Caregiver",
            required: true,
            index: true,
        },
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        isVerified: {
            type: Boolean,
            default: true, // Only users who completed booking can review
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate reviews
reviewSchema.index({ userId: 1, bookingId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
