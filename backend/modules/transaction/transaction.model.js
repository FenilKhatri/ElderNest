import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            required: true,
            unique: true,
        },
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        caregiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Caregiver",
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ["payment", "refund", "payout"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            default: "razorpay",
        },
        metadata: {
            type: Object,
        },
    },
    { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
