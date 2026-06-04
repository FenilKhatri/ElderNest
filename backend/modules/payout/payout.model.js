import mongoose from "mongoose";
import { PAYOUT_STATUS } from "../../common/utils/constants.js";

const payoutSchema = new mongoose.Schema(
    {
        caregiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Caregiver",
            required: true,
        },
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Admin who processed it
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(PAYOUT_STATUS),
            default: PAYOUT_STATUS.PENDING,
        },
        payoutMethod: {
            type: String, // e.g. "bank_transfer", "upi"
            default: "bank_transfer",
        },
        referenceId: {
            type: String, // Transaction ID from payment gateway/bank
        },
        notes: {
            type: String,
        },
        periodStart: {
            type: Date,
        },
        periodEnd: {
            type: Date,
        },
    },
    { timestamps: true }
);

const Payout = mongoose.model("Payout", payoutSchema);

export default Payout;
