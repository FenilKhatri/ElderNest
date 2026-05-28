import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import Review from "./review.model.js";
import Booking from "../booking/booking.model.js";
import Caregiver from "../caregiver/caregiver.model.js";
import Service from "../service/service.model.js";
import { createNotification } from "../../common/services/notification.service.js";
import mongoose from "mongoose";

// Create or add a review
export const createReview = asyncHandler(async (req, res) => {
    const { bookingId, caregiverId, serviceId, rating, comment, suggestions } = req.body;

    if (!caregiverId && !serviceId) {
        return errorResponse(res, 400, "Review must be associated with a caregiver or a service.");
    }
    if (caregiverId && serviceId) {
        return errorResponse(res, 400, "Review cannot be associated with both caregiver and service.");
    }

    let isVerified = false;

    // If reviewing a booking, verify it
    if (bookingId) {
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

        const existingReview = await Review.findOne({ bookingId });
        if (existingReview) {
            return errorResponse(res, 400, "Review already submitted for this booking");
        }
        isVerified = true;
    } else {
        // Prevent duplicate direct reviews
        const query = { userId: req.user.id };
        if (caregiverId) query.caregiverId = caregiverId;
        if (serviceId) query.serviceId = serviceId;
        query.bookingId = { $exists: false };

        const existingDirectReview = await Review.findOne(query);
        if (existingDirectReview) {
            return errorResponse(res, 400, "You have already submitted a review. You can update it instead.");
        }
    }

    const review = await Review.create({
        userId: req.user.id,
        caregiverId: caregiverId || undefined,
        serviceId: serviceId || undefined,
        bookingId: bookingId || undefined,
        rating,
        comment,
        suggestions,
        isVerified
    });

    // Update Caregiver rating if applicable
    if (caregiverId) {
        const caregiver = await Caregiver.findById(caregiverId).populate("userId");
        if (caregiver) {
            const reviews = await Review.find({ caregiverId, status: "approved" });
            if (reviews.length > 0) {
                const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
                caregiver.rating = parseFloat((totalRating / reviews.length).toFixed(1));
                caregiver.totalReviews = reviews.length;
                await caregiver.save();
            }

            if (caregiver.userId) {
                await createNotification(
                    caregiver.userId._id,
                    "new_review",
                    "New Review Received",
                    `You received a ${rating}-star review`,
                    "/caregiver/reviews"
                );
            }
        }
    }

    // Update Service rating if applicable
    if (serviceId) {
        const service = await Service.findById(serviceId);
        if (service) {
            const reviews = await Review.find({ serviceId, status: "approved" });
            // Assume we add logic for service rating if schema supports it, else just ignore
        }
    }

    return successResponse(res, 201, "Review submitted successfully", { review });
});

export const updateReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rating, comment, suggestions } = req.body;

    const review = await Review.findById(id);
    if (!review) return errorResponse(res, 404, "Review not found");

    if (review.userId.toString() !== req.user.id) {
        return errorResponse(res, 403, "Unauthorized");
    }

    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (suggestions !== undefined) review.suggestions = suggestions;

    await review.save();

    // Recalculate ratings
    if (review.caregiverId) {
        const caregiver = await Caregiver.findById(review.caregiverId);
        if (caregiver) {
            const reviews = await Review.find({ caregiverId: review.caregiverId, status: "approved" });
            const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
            caregiver.rating = reviews.length > 0 ? parseFloat((totalRating / reviews.length).toFixed(1)) : 0;
            caregiver.totalReviews = reviews.length;
            await caregiver.save();
        }
    }

    return successResponse(res, 200, "Review updated successfully", { review });
});

export const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return errorResponse(res, 404, "Review not found");

    // Only owner or admin can delete
    const isOwner = review.userId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
        return errorResponse(res, 403, "Unauthorized");
    }

    await review.deleteOne();

    // Recalculate ratings
    if (review.caregiverId) {
        const caregiver = await Caregiver.findById(review.caregiverId);
        if (caregiver) {
            const reviews = await Review.find({ caregiverId: review.caregiverId, status: "approved" });
            const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
            caregiver.rating = reviews.length > 0 ? parseFloat((totalRating / reviews.length).toFixed(1)) : 0;
            caregiver.totalReviews = reviews.length;
            await caregiver.save();
        }
    }

    return successResponse(res, 200, "Review deleted successfully");
});

export const getCaregiverReviews = asyncHandler(async (req, res) => {
    const { caregiverId } = req.params;

    const reviews = await Review.find({ caregiverId, status: "approved" })
        .populate("userId", "name profileImage")
        .populate("replies.userId", "name role profileImage")
        .sort({ createdAt: -1 });

    return successResponse(res, 200, "Reviews fetched", { reviews });
});

export const getServiceReviews = asyncHandler(async (req, res) => {
    const { serviceId } = req.params;

    const reviews = await Review.find({ serviceId, status: "approved" })
        .populate("userId", "name profileImage")
        .populate("replies.userId", "name role profileImage")
        .sort({ createdAt: -1 });

    return successResponse(res, 200, "Service reviews fetched", { reviews });
});

export const getUserReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ userId: req.user.id })
        .populate({
            path: "caregiverId",
            populate: { path: "userId", select: "name profileImage" },
        })
        .populate("serviceId", "name")
        .sort({ createdAt: -1 });

    return successResponse(res, 200, "Reviews fetched", { reviews });
});

export const addReply = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
        return errorResponse(res, 400, "Reply comment is required");
    }

    const review = await Review.findById(id);
    if (!review) return errorResponse(res, 404, "Review not found");

    // Check if user is authorized to reply (e.g., admin or the caregiver being reviewed)
    if (req.user.role !== "admin") {
        if (!review.caregiverId) {
            return errorResponse(res, 403, "Only admins can reply to service reviews");
        }
        const caregiver = await Caregiver.findOne({ userId: req.user.id });
        if (!caregiver || caregiver._id.toString() !== review.caregiverId.toString()) {
            return errorResponse(res, 403, "Unauthorized to reply to this review");
        }
    }

    review.replies.push({
        userId: req.user.id,
        comment,
    });

    await review.save();
    return successResponse(res, 201, "Reply added successfully", { review });
});

export const reportReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return errorResponse(res, 404, "Review not found");

    review.isReported = true;
    await review.save();

    return successResponse(res, 200, "Review reported successfully");
});
