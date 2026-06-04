import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import Refund from "./refund.model.js";
import Booking from "../booking/booking.model.js";
import Transaction from "../transaction/transaction.model.js";
import Wallet from "../wallet/wallet.model.js";
import WalletTransaction from "../wallet/walletTransaction.model.js";
import { isBookingOwner } from "../../common/utils/booking.utils.js";
import { PAYMENT_STATUS, BOOKING_STATUS, REFUND_STATUS, TRANSACTION_STATUS } from "../../common/utils/constants.js";

export const createRefundRequest = asyncHandler(async (req, res) => {
    const { bookingId, reason } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        return errorResponse(res, 404, "Booking not found");
    }

    if (!isBookingOwner(req.user, booking)) {
        console.error("Refund Request Failed: Not authorized. User ID:", req.user.id, "Booking Owner ID:", booking.userId);
        return errorResponse(res, 403, "Not authorized to request refund for this booking");
    }

    if (booking.paymentStatus !== PAYMENT_STATUS.PAID || !booking.transactionId) {
        return errorResponse(res, 400, "Booking is not paid. Cannot request refund.");
    }

    const existingRefund = await Refund.findOne({ bookingId });
    if (existingRefund) {
        return errorResponse(res, 400, "A refund request already exists for this booking");
    }

    const refund = await Refund.create({
        bookingId,
        userId: req.user.id,
        caregiverId: booking.caregiverId,
        transactionId: booking.transactionId,
        amount: booking.totalAmount,
        reason,
    });

    booking.status = BOOKING_STATUS.CANCELLED;
    booking.refundStatus = REFUND_STATUS.PENDING;
    await booking.save();

    return successResponse(res, 201, "Refund request submitted successfully", { refund });
});

export const getAllRefunds = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 50 } = req.query;
    const query = {};
    if (status) query.status = status;

    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = parseInt(limit, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    const [refunds, total] = await Promise.all([
        Refund.find(query)
            .populate("userId", "name email")
            .populate({ path: "caregiverId", populate: { path: "userId", select: "name email" } })
            .populate("bookingId", "bookingId serviceId timeSlot totalAmount")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parsedLimit),
        Refund.countDocuments(query)
    ]);

    const hasMore = total > skip + refunds.length;

    return successResponse(res, 200, "Refunds fetched successfully", { 
        refunds,
        pagination: { total, page: parsedPage, limit: parsedLimit, hasMore }
    });
});

export const updateRefundStatus = asyncHandler(async (req, res) => {
    const { status, adminNotes } = req.body;

    const refund = await Refund.findById(req.params.id);
    if (!refund) {
        return errorResponse(res, 404, "Refund request not found");
    }

    refund.status = status;
    if (adminNotes) {
        refund.adminNotes = adminNotes;
    }

    await refund.save();

    const booking = await Booking.findById(refund.bookingId);
    if (booking) {
        booking.refundStatus = status;
        if (status === REFUND_STATUS.PROCESSED || status === REFUND_STATUS.REFUNDED) {
            booking.paymentStatus = PAYMENT_STATUS.REFUNDED;
        }
        await booking.save();
    }

    // If processed, create a refund transaction record and credit wallet
    if (status === REFUND_STATUS.PROCESSED) {
        await Transaction.create({
            transactionId: `ref_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            bookingId: refund.bookingId,
            userId: refund.userId,
            caregiverId: refund.caregiverId,
            amount: refund.amount,
            type: "refund",
            status: TRANSACTION_STATUS.COMPLETED,
            metadata: { refundId: refund._id }
        });

        // Credit Wallet
        let wallet = await Wallet.findOne({ user: refund.userId });
        if (!wallet) {
            wallet = await Wallet.create({ user: refund.userId });
        }
        
        wallet.balance += refund.amount;
        wallet.totalRefunded += refund.amount;
        wallet.totalTransactions += 1;
        await wallet.save();

        await WalletTransaction.create({
            wallet: wallet._id,
            user: refund.userId,
            booking: refund.bookingId,
            transactionType: "Refund Credit",
            amount: refund.amount,
            status: "Completed",
            refundReason: refund.reason,
            adminComment: adminNotes
        });
    }

    return successResponse(res, 200, "Refund status updated successfully", { refund });
});
