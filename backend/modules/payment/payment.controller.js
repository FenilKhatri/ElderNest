import crypto from "crypto";
import getRazorpayInstance from "../../config/razorpay.js";
import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import * as bookingService from "../booking/booking.services.js";
import Booking from "../booking/booking.model.js";
import { generateReceiptPdf, generateBookingPdf } from "../../common/utils/pdf/index.js";
import { sendEmail } from "../../common/services/email.service.js";

/**
 * POST /api/payments/create-order
 * Creates a Razorpay order from booking data.
 * Does NOT create the booking yet — booking is created on successful payment verification.
 */
export const createOrder = asyncHandler(async (req, res) => {
    // We expect the request body to be the booking data itself
    const bookingData = req.body;

    if (!bookingData || !bookingData.caregiverId || !bookingData.serviceId) {
        return errorResponse(res, 400, "Booking data with caregiverId and serviceId is required");
    }

    // Calculate the amount using existing booking service logic
    const { totalAmount } = await bookingService.calculateBookingDetails(
        bookingData.serviceId,
        bookingData.timeSlot?.startTime,
        bookingData.timeSlot?.endTime
    );

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

    const razorpayInstance = getRazorpayInstance();
    const order = await razorpayInstance.orders.create(options);

    return successResponse(res, 200, "Razorpay order created", {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        bookingData,
    });
});

/**
 * POST /api/payments/verify
 * Verifies Razorpay payment signature, creates the booking, generates PDFs, sends email.
 */
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

    // 1. Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        return errorResponse(res, 400, "Payment verification failed. Invalid signature.");
    }

    // 2. Create the actual booking via existing service
    const booking = await bookingService.createBooking(req.user.id, bookingData);

    // 3. Mark payment as completed
    booking.paymentStatus = "paid";
    booking.transactionId = razorpay_payment_id;
    booking.razorpayOrderId = razorpay_order_id;
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.paymentDate = new Date();
    await booking.save();

    // 4. Generate PDFs (non-blocking — don't fail the request if PDF gen fails)
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

        // 5. Send confirmation email with PDF attachments
        await sendEmail(
            populatedBooking.userId.email,
            "bookingPaymentConfirmation",
            {
                userName: populatedBooking.userId.name,
                bookingId: booking.bookingId,
                caregiverName: populatedBooking.caregiverId?.userId?.name || "Caregiver",
                serviceName: populatedBooking.serviceId?.title || "Care Service",
                amount: populatedBooking.totalAmount,
                transactionId: razorpay_payment_id,
                date: new Date(populatedBooking.bookingDate).toLocaleDateString(),
                time: `${populatedBooking.timeSlot.startTime} - ${populatedBooking.timeSlot.endTime}`,
            }
        );
    } catch (pdfError) {
        console.error("PDF/Email generation failed (non-critical):", pdfError);
    }

    return successResponse(res, 201, "Payment verified and booking created successfully", {
        booking,
        paymentId: razorpay_payment_id,
    });
});

/**
 * GET /api/payments/key
 * Returns the Razorpay publishable key to the frontend.
 */
export const getRazorpayKey = asyncHandler(async (req, res) => {
    return successResponse(res, 200, "Razorpay key", {
        key: process.env.RAZORPAY_KEY_ID,
    });
});
