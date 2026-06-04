import crypto from "crypto";
import getRazorpayInstance from "../../config/razorpay.js";
import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import * as bookingService from "../booking/booking.services.js";
import { acquireSlotLock, releaseSlotLock } from "../booking/slotLocking.service.js";
import Booking from "../booking/booking.model.js";
import { generateReceiptPdf, generateBookingPdf } from "../../common/utils/pdf/index.js";
import { BOOKING_STATUS, PAYMENT_STATUS } from "../../common/utils/constants.js";

export const createOrder = asyncHandler(async (req, res) => {
    // We expect the request body to be the booking data itself
    const bookingData = req.body;

    if (!bookingData || !bookingData.caregiverId || !bookingData.serviceId) {
        return errorResponse(res, 400, "Booking data with caregiverId and serviceId is required");
    }

    // Pre-validate the booking (throws error if invalid)
    try {
        await bookingService.validateBookingRequest(req.user.id, bookingData);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }

    // Calculate the amount using existing booking service logic
    const { totalAmount } = await bookingService.calculateBookingDetails(
        bookingData.caregiverId,
        bookingData.billingType,
        bookingData.quantity
    );

    // Acquire slot lock to prevent double booking race conditions
    const lock = await acquireSlotLock(
        bookingData.caregiverId,
        bookingData.bookingDate,
        bookingData.timeSlot?.startTime,
        bookingData.timeSlot?.endTime,
        req.user.id
    );

    if (!lock) {
        return errorResponse(res, 409, "This time slot is currently being booked by someone else. Please try another slot or try again in 10 minutes.");
    }

    const amountInPaise = Math.round(totalAmount * 100); // Razorpay expects amount in paise

    const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: {
            userId: req.user.id,
            caregiverId: bookingData.caregiverId,
            serviceId: bookingData.serviceId,
        },
    };

    console.log("KEY:", process.env.RAZORPAY_KEY_ID);
    console.log("SECRET EXISTS:", !!process.env.RAZORPAY_KEY_SECRET);
    console.log("ORDER OPTIONS:", options);

    const razorpayInstance = getRazorpayInstance();
    try {
        const order = await razorpayInstance.orders.create(options);

        return successResponse(res, 200, "Razorpay order created", {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            bookingData,
        });
    } catch (error) {
        console.error("CREATE ORDER ERROR:");
        console.error(error);
        console.error(error.stack);

        return res.status(400).json({
            success: false,
            message: error.error?.description || error.message || "Failed to create Razorpay order",
            errorName: error.name,
            stack: process.env.NODE_ENV === "development"
                ? error.stack
                : undefined
        });
    }
});

export const verifyPayment = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bookingData,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return errorResponse(res, 400, "Payment verification data missing");
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        return errorResponse(res, 400, "Payment verification failed. Invalid signature.");
    }

    const booking = await bookingService.createBooking(req.user.id, bookingData);

    // Release the slot lock now that booking is confirmed
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

    await Booking.findByIdAndUpdate(booking._id, { status: BOOKING_STATUS.PENDING });
    booking.paymentStatus = PAYMENT_STATUS.PAID;
    booking.transactionId = razorpay_payment_id;
    booking.razorpayOrderId = razorpay_order_id;
    booking.razorpayPaymentId = razorpay_payment_id;
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
        console.error("PDF/Email generation failed (non-critical):", pdfError);
    }

    return successResponse(res, 201, "Payment verified and booking created successfully", {
        booking,
        paymentId: razorpay_payment_id,
    });
});

export const getRazorpayKey = asyncHandler(async (req, res) => {
    return successResponse(res, 200, "Razorpay key", {
        key: process.env.RAZORPAY_KEY_ID,
    });
});
