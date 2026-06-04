import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import Wallet from "./wallet.model.js";
import WalletTransaction from "./walletTransaction.model.js";
import Booking from "../booking/booking.model.js";
import * as bookingService from "../booking/booking.services.js";
import { acquireSlotLock, releaseSlotLock } from "../booking/slotLocking.service.js";
import { generateReceiptPdf, generateBookingPdf } from "../../common/utils/pdf/index.js";
import { BOOKING_STATUS, PAYMENT_STATUS } from "../../common/utils/constants.js";

export const getWalletSummary = asyncHandler(async (req, res) => {
    let wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
        wallet = await Wallet.create({ user: req.user.id });
    }
    return successResponse(res, 200, "Wallet summary fetched successfully", { wallet });
});

export const getWalletTransactions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = parseInt(limit, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    let wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
        wallet = await Wallet.create({ user: req.user.id });
    }

    const [transactions, total] = await Promise.all([
        WalletTransaction.find({ wallet: wallet._id })
            .populate("booking", "bookingId serviceId totalAmount")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parsedLimit),
        WalletTransaction.countDocuments({ wallet: wallet._id })
    ]);

    const hasMore = total > skip + transactions.length;

    return successResponse(res, 200, "Wallet transactions fetched", {
        transactions,
        pagination: { total, page: parsedPage, limit: parsedLimit, hasMore }
    });
});

export const payWithWallet = asyncHandler(async (req, res) => {
    const bookingData = req.body;

    if (!bookingData || !bookingData.caregiverId || !bookingData.serviceId) {
        return errorResponse(res, 400, "Booking data with caregiverId and serviceId is required");
    }

    // Pre-validate the booking
    try {
        await bookingService.validateBookingRequest(req.user.id, bookingData);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }

    // Calculate the amount
    const { totalAmount } = await bookingService.calculateBookingDetails(
        bookingData.caregiverId,
        bookingData.billingType,
        bookingData.quantity
    );

    let wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
        wallet = await Wallet.create({ user: req.user.id });
    }

    if (wallet.balance < totalAmount) {
        return errorResponse(res, 400, "Insufficient wallet balance");
    }

    // Acquire slot lock
    const lock = await acquireSlotLock(
        bookingData.caregiverId,
        bookingData.bookingDate,
        bookingData.timeSlot?.startTime,
        bookingData.timeSlot?.endTime,
        req.user.id
    );

    if (!lock) {
        return errorResponse(res, 409, "This time slot is currently being booked by someone else.");
    }

    // Create Booking
    const booking = await bookingService.createBooking(req.user.id, bookingData);

    // Release the slot lock
    try {
        await releaseSlotLock(
            bookingData.caregiverId,
            bookingData.bookingDate,
            bookingData.timeSlot?.startTime,
            bookingData.timeSlot?.endTime
        );
    } catch (lockError) {
        console.error("Failed to release slot lock (non-critical):", lockError);
    }

    // Update Wallet Balance
    wallet.balance -= totalAmount;
    wallet.totalTransactions += 1;
    await wallet.save();

    // Create Wallet Transaction
    const walletTx = await WalletTransaction.create({
        wallet: wallet._id,
        user: req.user.id,
        booking: booking._id,
        transactionType: "Wallet Debit",
        amount: totalAmount,
        status: "Completed",
    });

    await Booking.findByIdAndUpdate(booking._id, { status: BOOKING_STATUS.PENDING });
    booking.paymentStatus = PAYMENT_STATUS.PAID;
    booking.transactionId = walletTx._id.toString();
    booking.paymentDate = new Date();
    await booking.save();

    try {
        const populatedBooking = await Booking.findById(booking._id)
            .populate("userId", "name email phone")
            .populate({
                path: "caregiverId",
                populate: { path: "userId", select: "name email" },
            })
            .populate("serviceId", "title description price category");

        const receiptUrl = await generateReceiptPdf(populatedBooking);
        const bookingPdfUrl = await generateBookingPdf(populatedBooking);

        booking.paymentReceiptUrl = receiptUrl;
        booking.bookingPdfUrl = bookingPdfUrl;
        await booking.save();
    } catch (pdfError) {
        console.error("PDF generation failed:", pdfError);
    }

    return successResponse(res, 201, "Booking created and paid successfully using wallet", {
        booking,
    });
});
