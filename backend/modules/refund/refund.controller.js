import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import Refund from "./refund.model.js";
import Booking from "../booking/booking.model.js";
import Transaction from "../transaction/transaction.model.js";

// @desc    Request a refund (User)
// @route   POST /api/refunds
export const createRefundRequest = asyncHandler(async (req, res) => {
    const { bookingId, reason } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        return errorResponse(res, 404, "Booking not found");
    }

    if (booking.userId.toString() !== req.user.id) {
        return errorResponse(res, 403, "Not authorized to request refund for this booking");
    }

    if (booking.paymentStatus !== "paid" || !booking.transactionId) {
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

    booking.status = "cancelled";
    await booking.save();

    return successResponse(res, 201, "Refund request submitted successfully", { refund });
});

// @desc    Get all refund requests (Admin)
// @route   GET /api/refunds
export const getAllRefunds = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const refunds = await Refund.find(query)
        .populate("userId", "name email")
        .populate({ path: "caregiverId", populate: { path: "userId", select: "name email" } })
        .populate("bookingId", "bookingId serviceId timeSlot totalAmount")
        .sort({ createdAt: -1 });

    return successResponse(res, 200, "Refunds fetched successfully", { refunds });
});

// @desc    Update refund status (Admin)
// @route   PATCH /api/refunds/:id/status
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

    // If processed, create a refund transaction record
    if (status === "processed") {
        await Transaction.create({
            transactionId: `ref_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            bookingId: refund.bookingId,
            userId: refund.userId,
            caregiverId: refund.caregiverId,
            amount: refund.amount,
            type: "refund",
            status: "completed",
            metadata: { refundId: refund._id }
        });
    }

    return successResponse(res, 200, "Refund status updated successfully", { refund });
});
