import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import { validationResult } from "express-validator";
import * as bookingService from "./booking.services.js";

// Create booking
export const createBooking = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const booking = await bookingService.createBooking(req.user.id, req.body);
    return successResponse(res, 201, "Booking created successfully", { booking });
});

// Get user bookings
export const getUserBookings = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const bookings = await bookingService.getUserBookings(req.user.id, status);
    return successResponse(res, 200, "Bookings fetched successfully", { bookings });
});

// Get caregiver bookings
export const getCaregiverBookings = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const { caregiverId } = req.params;
    
    const bookings = await bookingService.getCaregiverBookings(caregiverId, status);
    return successResponse(res, 200, "Bookings fetched successfully", { bookings });
});

// Update booking status
export const updateBookingStatus = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const { id } = req.params;
    const { status, rejectionReason, cancellationReason } = req.body;
    const reason = rejectionReason || cancellationReason;

    const booking = await bookingService.updateBookingStatus(
        id,
        req.user.id,
        req.user.role,
        status,
        reason
    );

    return successResponse(res, 200, "Booking status updated", { booking });
});

// Get booking by ID
export const getBookingById = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);

    // Authorization check
    if (
        req.user.role !== "admin" &&
        booking.userId._id.toString() !== req.user.id &&
        booking.caregiverId.userId._id.toString() !== req.user.id
    ) {
        return errorResponse(res, 403, "Unauthorized");
    }

    return successResponse(res, 200, "Booking fetched successfully", { booking });
});

// Get all bookings (admin)
export const getAllBookings = asyncHandler(async (req, res) => {
    const filters = req.query;
    const bookings = await bookingService.getAllBookings(filters);
    return successResponse(res, 200, "Bookings fetched successfully", { bookings });
});

// Delete booking (admin)
export const deleteBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await bookingService.deleteBooking(id);
    return successResponse(res, 200, "Booking deleted successfully");
});
