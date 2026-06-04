import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
    {
        wallet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Wallet",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
        },
        transactionType: {
            type: String,
            enum: ["Refund Credit", "Wallet Debit", "Adjustment"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Completed", "Failed"],
            default: "Completed",
        },
        refundReason: {
            type: String,
        },
        adminComment: {
            type: String,
        },
    },
    { timestamps: true }
);

const WalletTransaction = mongoose.model("WalletTransaction", walletTransactionSchema);
export default WalletTransaction;
