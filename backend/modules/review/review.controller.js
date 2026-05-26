import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import Review from "./review.model.js";
import Booking from "../booking/booking.model.js";
import Caregiver from "../caregiver/caregiver.model.js";
import { createNotification } from "../../common/services/notification.service.js";

// Create review
export const createReview = asyncHandler(async (req, res) => {
    const { bookingId, rating, comment } = req.body;

    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        return errorResponse(res, 404, "Booking not found");
    }

    if (booking.userId.toString() !== req.user.id) {
        return errorResponse(res, 403, "Unauthorized");
    }

    if (booking.status !== "completed") {
        return errorResponse(res, 400, "Can only review completed bookings");
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
        return errorResponse(res, 400, "Review already submitted for this booking");
    }

    // Create review
    const review = await Review.create({
        userId: req.user.id,
        caregiverId: booking.caregiverId,
        bookingId,
        rating,
        comment,
    });

    // Update caregiver rating
    const caregiver = await Caregiver.findById(booking.caregiverId).populate("userId");
    const reviews = await Review.find({ caregiverId: booking.caregiverId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / reviews.length;

    caregiver.rating = parseFloat(avgRating.toFixed(1));
    caregiver.totalReviews = reviews.length;
    await caregiver.save();

    // Notify caregiver
    await createNotification(
        caregiver.userId._id,
        "new_review",
        "New Review Received",
        `You received a ${rating}-star review`,
        "/caregiver/reviews"
    );

    return successResponse(res, 201, "Review submitted successfully", { review });
});

// Get caregiver reviews
export const getCaregiverReviews = asyncHandler(async (req, res) => {
    const { caregiverId } = req.params;

    const reviews = await Review.find({ caregiverId })
        .populate("userId", "name profileImage")
        .sort({ createdAt: -1 });

    return successResponse(res, 200, "Reviews fetched", { reviews });
});

// Get user reviews
export const getUserReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ userId: req.user.id })
        .populate({
            path: "caregiverId",
            populate: { path: "userId", select: "name profileImage" },
        })
        .sort({ createdAt: -1 });

    return successResponse(res, 200, "Reviews fetched", { reviews });
});
