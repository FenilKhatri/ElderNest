import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        caregiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Caregiver",
            required: true,
        },
        transactionId: {
            type: String, // Razorpay payment ID
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "processed"],
            default: "pending",
        },
        adminNotes: {
            type: String,
        },
    },
    { timestamps: true }
);

const Refund = mongoose.model("Refund", refundSchema);

export default Refund;
