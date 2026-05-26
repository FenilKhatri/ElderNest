import Booking from "./booking.model.js";
import Caregiver from "../caregiver/caregiver.model.js";
import Service from "../service/service.model.js";
import User from "../user/user.model.js";
import { validateLocation } from "../../common/validators/location.validator.js";
import { createNotification } from "../../common/services/notification.service.js";
import { sendEmail } from "../../common/services/email.service.js";

// Check slot availability
export const checkSlotAvailability = async (caregiverId, bookingDate, startTime, endTime) => {
    const date = new Date(bookingDate);
    date.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    // Check for overlapping bookings
    const existingBooking = await Booking.findOne({
        caregiverId,
        bookingDate: {
            $gte: date,
            $lt: nextDay,
        },
        status: { $in: ["pending", "accepted", "in-progress"] },
        $or: [
            {
                "timeSlot.startTime": { $lt: endTime },
                "timeSlot.endTime": { $gt: startTime },
            },
        ],
    });

    return !existingBooking;
};

// Calculate duration and amount
export const calculateBookingDetails = async (serviceId, startTime, endTime) => {
    const service = await Service.findById(serviceId);
    if (!service) {
        throw new Error("Service not found");
    }

    const start = startTime.split(":").map(Number);
    const end = endTime.split(":").map(Number);
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    const duration = (endMinutes - startMinutes) / 60;

    const totalAmount = service.basePrice * duration;

    return { duration, totalAmount, service };
};

// Create booking
export const createBooking = async (userId, bookingData) => {
    const {
        caregiverId,
        serviceId,
        bookingDate,
        timeSlot,
        address,
        ...otherData
    } = bookingData;

    // Validate caregiver exists and is approved
    const caregiver = await Caregiver.findById(caregiverId).populate("userId");
    if (!caregiver) {
        throw new Error("Caregiver not found");
    }

    if (!caregiver.userId.isApproved || caregiver.profileApprovalStatus !== "approved") {
        throw new Error("Caregiver is not available for booking");
    }

    // Validate location
    const locationValidation = validateLocation(
        address.state,
        address.city,
        address.pincode
    );
    if (!locationValidation.isValid) {
        throw new Error(locationValidation.errors.join(", "));
    }

    // Check slot availability
    const isAvailable = await checkSlotAvailability(
        caregiverId,
        bookingDate,
        timeSlot.startTime,
        timeSlot.endTime
    );

    if (!isAvailable) {
        throw new Error("Selected time slot is not available");
    }

    // Calculate booking details
    const { duration, totalAmount } = await calculateBookingDetails(
        serviceId,
        timeSlot.startTime,
        timeSlot.endTime
    );

    // Create booking
    const booking = await Booking.create({
        userId,
        caregiverId,
        serviceId,
        bookingDate,
        timeSlot,
        address,
        duration,
        totalAmount,
        ...otherData,
    });

    // Populate booking details
    await booking.populate([
        { path: "userId", select: "name email phone" },
        { path: "caregiverId", populate: { path: "userId", select: "name email" } },
        { path: "serviceId", select: "name description" },
    ]);

    // Send notifications
    await createNotification(
        caregiver.userId._id,
        "booking_created",
        "New Booking Request",
        `You have a new booking request for ${booking.patientName}`,
        "/caregiver/bookings",
        { bookingId: booking._id }
    );

    await createNotification(
        userId,
        "booking_created",
        "Booking Created",
        `Your booking request has been sent to ${caregiver.userId.name}`,
        "/user/bookings",
        { bookingId: booking._id }
    );

    // Send emails
    const user = await User.findById(userId);
    await sendEmail(
        user.email,
        "bookingConfirmationUser",
        {
            userName: user.name,
            bookingId: booking.bookingId,
            caregiverName: caregiver.userId.name,
            date: new Date(bookingDate).toLocaleDateString(),
            time: `${timeSlot.startTime} - ${timeSlot.endTime}`,
        }
    );

    await sendEmail(
        caregiver.userId.email,
        "bookingNotificationCaregiver",
        {
            caregiverName: caregiver.userId.name,
            bookingId: booking.bookingId,
            patientName: booking.patientName,
            date: new Date(bookingDate).toLocaleDateString(),
            time: `${timeSlot.startTime} - ${timeSlot.endTime}`,
        }
    );

    return booking;
};

// Get user bookings
export const getUserBookings = async (userId, status = null) => {
    const query = { userId };
    if (status) {
        query.status = status;
    }

    const bookings = await Booking.find(query)
        .populate("caregiverId", "userId rating")
        .populate({
            path: "caregiverId",
            populate: { path: "userId", select: "name email profileImage" },
        })
        .populate("serviceId", "name description")
        .sort({ createdAt: -1 });

    return bookings;
};

// Get caregiver bookings
export const getCaregiverBookings = async (caregiverId, status = null) => {
    const query = { caregiverId };
    if (status) {
        query.status = status;
    }

    const bookings = await Booking.find(query)
        .populate("userId", "name email phone profileImage")
        .populate("serviceId", "name description")
        .sort({ createdAt: -1 });

    return bookings;
};

// Update booking status
export const updateBookingStatus = async (bookingId, userId, userRole, status, reason = null) => {
    const booking = await Booking.findById(bookingId)
        .populate("userId", "name email")
        .populate({
            path: "caregiverId",
            populate: { path: "userId", select: "name email" },
        });

    if (!booking) {
        throw new Error("Booking not found");
    }

    // Authorization check
    if (userRole === "caregiver" && booking.caregiverId.userId._id.toString() !== userId) {
        throw new Error("Unauthorized");
    }
    if (userRole === "user" && booking.userId._id.toString() !== userId) {
        throw new Error("Unauthorized");
    }

    // Update status
    booking.status = status;

    if (status === "rejected") {
        booking.rejectionReason = reason;
    }

    if (status === "cancelled") {
        booking.cancellationReason = reason;
        booking.cancelledBy = userRole;
        booking.cancelledAt = new Date();
    }

    if (status === "completed") {
        booking.completedAt = new Date();
        // Update caregiver total bookings
        await Caregiver.findByIdAndUpdate(booking.caregiverId._id, {
            $inc: { totalBookings: 1 },
        });
    }

    await booking.save();

    // Send notifications
    if (status === "accepted") {
        await createNotification(
            booking.userId._id,
            "booking_accepted",
            "Booking Accepted",
            `Your booking has been accepted by ${booking.caregiverId.userId.name}`,
            "/user/bookings"
        );

        await sendEmail(
            booking.userId.email,
            "bookingAccepted",
            {
                userName: booking.userId.name,
                bookingId: booking.bookingId,
                caregiverName: booking.caregiverId.userId.name,
            }
        );
    }

    if (status === "rejected") {
        await createNotification(
            booking.userId._id,
            "booking_rejected",
            "Booking Update",
            `Your booking request could not be accepted`,
            "/user/bookings"
        );

        await sendEmail(
            booking.userId.email,
            "bookingRejected",
            {
                userName: booking.userId.name,
                bookingId: booking.bookingId,
                reason: reason || "Not specified",
            }
        );
    }

    if (status === "completed") {
        await createNotification(
            booking.userId._id,
            "booking_completed",
            "Booking Completed",
            "Your booking has been completed. Please leave a review.",
            "/user/bookings"
        );
    }

    return booking;
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
    const booking = await Booking.findById(bookingId)
        .populate("userId", "name email phone profileImage")
        .populate({
            path: "caregiverId",
            populate: { path: "userId", select: "name email phone profileImage" },
        })
        .populate("serviceId", "name description basePrice");

    if (!booking) {
        throw new Error("Booking not found");
    }

    return booking;
};

// Get all bookings (admin)
export const getAllBookings = async (filters = {}) => {
    const query = {};
    
    if (filters.status) {
        query.status = filters.status;
    }
    
    if (filters.startDate && filters.endDate) {
        query.bookingDate = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate),
        };
    }

    const bookings = await Booking.find(query)
        .populate("userId", "name email")
        .populate({
            path: "caregiverId",
            populate: { path: "userId", select: "name email" },
        })
        .populate("serviceId", "name")
        .sort({ createdAt: -1 });

    return bookings;
};
