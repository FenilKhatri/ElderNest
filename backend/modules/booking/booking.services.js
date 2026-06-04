import Booking from "./booking.model.js";
import Caregiver from "../caregiver/caregiver.model.js";
import Service from "../service/service.model.js";
import User from "../user/user.model.js";
import Patient from "../patient/patient.model.js";
import { validateLocation } from "../../common/validators/location.validator.js";
import { createNotification } from "../../common/services/notification.service.js";

import { isSlotLocked } from "./slotLocking.service.js";
import { isSlotAvailable } from "../../common/utils/slotGenerator.js";
import CaregiverAvailability from "../caregiver/caregiverAvailability.model.js";

// Check slot availability
export const checkSlotAvailability = async (caregiverId, bookingDate, startTime, endTime, excludeUserId = null) => {
    // 1. Check if the slot is locked by someone else
    const date = new Date(bookingDate);
    date.setHours(0, 0, 0, 0);
    const locked = await isSlotLocked(caregiverId, date, startTime, endTime, excludeUserId);
    if (locked) return false;

    // 2. Check if the slot is actually available (falls in availability blocks & no overlap)
    return await isSlotAvailable(caregiverId, bookingDate, startTime, endTime);
};

// Calculate amount based on caregiver pricing
export const calculateBookingDetails = async (caregiverId, billingType, quantity) => {
    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) {
        throw new Error("Caregiver not found");
    }

    let unitRate = 0;
    if (billingType === "hourly") {
        unitRate = caregiver.pricing?.hourlyRate || 0;
    } else if (billingType === "daily") {
        unitRate = caregiver.pricing?.dailyRate || 0;
    } else if (billingType === "monthly") {
        unitRate = caregiver.pricing?.monthlyRate || 0;
    }

    if (unitRate === 0) {
        throw new Error(`Caregiver has not set a ${billingType} rate`);
    }

    const totalAmount = unitRate * quantity;

    return { unitRate, quantity, totalAmount };
};

export const validateBookingRequest = async (userId, bookingData) => {
    const {
        caregiverId,
        serviceId,
        bookingDate,
        timeSlot,
        address,
        patientId
    } = bookingData;

    const caregiver = await Caregiver.findById(caregiverId).populate("userId");
    if (!caregiver) {
        throw new Error("Caregiver not found");
    }

    const { isCaregiverBookable } = await import("../../common/utils/caregiverOnboarding.js");
    if (!isCaregiverBookable(caregiver)) {
        throw new Error("Caregiver is not available for booking");
    }

    const locationValidation = validateLocation(
        address.state,
        address.city,
        address.pincode
    );
    if (!locationValidation.isValid) {
        throw new Error(locationValidation.errors.join(", "));
    }

    let calculatedEndTime = timeSlot.endTime;

    if (!calculatedEndTime) {
        // Find slot duration
        const dateObj = new Date(bookingDate);
        dateObj.setHours(0, 0, 0, 0);
        const dayOfWeek = dateObj.getDay();
        const block = await CaregiverAvailability.findOne({
            caregiverId,
            dayOfWeek,
            isActive: true,
            startTime: { $lte: timeSlot.startTime },
            endTime: { $gt: timeSlot.startTime }
        });
        
        if (!block) {
            throw new Error("No availability found for this time");
        }

        const startArr = timeSlot.startTime.split(":").map(Number);
        let endMins = startArr[0] * 60 + startArr[1] + block.slotDuration;
        const h = String(Math.floor(endMins / 60)).padStart(2, "0");
        const m = String(endMins % 60).padStart(2, "0");
        calculatedEndTime = `${h}:${m}`;
        timeSlot.endTime = calculatedEndTime;
    }

    // Check slot availability (exclude this user's own locks)
    const isAvailable = await checkSlotAvailability(
        caregiverId,
        bookingDate,
        timeSlot.startTime,
        calculatedEndTime,
        userId
    );

    if (!isAvailable) {
        throw new Error("Selected time slot is not available");
    }

    const service = await Service.findById(serviceId);
    if (!service) {
        throw new Error("Service not found");
    }
    const offersService = caregiver.servicesOffered?.some(
        (s) => s.toString() === serviceId.toString()
    );
    const assignedOnService = service.caregivers?.some(
        (c) => c.toString() === caregiverId.toString()
    );
    if (!offersService && !assignedOnService) {
        throw new Error("This caregiver is not assigned to the selected service");
    }

    if (patientId) {
        const patient = await Patient.findOne({ _id: patientId, userId });
        if (!patient) {
            throw new Error("Patient profile not found");
        }
    }

    return { caregiver, service, timeSlot };
};

export const createBooking = async (userId, bookingData) => {
    const {
        caregiverId,
        serviceId,
        bookingDate,
        timeSlot,
        address,
        serviceType,
        billingType,
        quantity,
        ...otherData
    } = bookingData;

    const { caregiver, service, timeSlot: finalTimeSlot } = await validateBookingRequest(userId, bookingData);

    // Load patient profile if provided
    let patientFields = {};
    if (otherData.patientId) {
        const patient = await Patient.findOne({ _id: otherData.patientId, userId });
        patientFields = {
            patientId: patient._id,
            patientName: patient.name,
            patientAge: patient.age,
            emergencyContact: patient.emergencyContact?.name
                ? patient.emergencyContact
                : otherData.emergencyContact,
        };
    }

    // Calculate booking details
    const { unitRate, totalAmount } = await calculateBookingDetails(
        caregiverId,
        billingType,
        quantity
    );

    let booking;
    try {
        booking = await Booking.create({
            userId,
            caregiverId,
            serviceId,
            bookingDate,
            timeSlot: finalTimeSlot,
            address,
            serviceType,
            billingType,
            quantity,
            unitRate,
            totalAmount,
            ...otherData,
            ...patientFields,
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new Error("This time slot has just been booked by someone else. Please select another slot.");
        }
        throw error;
    }

    await Service.findByIdAndUpdate(serviceId, { $inc: { totalBookings: 1 } });

    // Populate booking details
    await booking.populate([
        { path: "userId", select: "name email phone" },
        { path: "caregiverId", populate: { path: "userId", select: "name email" } },
        { path: "serviceId", select: "title description price" },
    ]);

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

    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
        await createNotification(
            admin._id,
            "booking_created",
            "New Booking Alert",
            `A new booking request was created for caregiver ${caregiver.userId.name}.`,
            "/admin/bookings"
        );
    }

    return booking;
};

export const getUserBookings = async (userId, status = null) => {
    const query = { userId };
    if (status) {
        query.status = status;
    }

    const bookings = await Booking.find(query)
        .populate({
            path: "caregiverId",
            select: "userId rating profileImage fullName",
            populate: { path: "userId", select: "name email profileImage" },
        })
        .populate("serviceId", "title description price")
        .sort({ createdAt: -1 });

    return bookings;
};

export const getCaregiverBookings = async (caregiverId, status = null) => {
    const query = { caregiverId };
    if (status) {
        query.status = status;
    }

    const bookings = await Booking.find(query)
        .populate("userId", "name email phone profileImage")
        .populate("serviceId", "title description price")
        .sort({ createdAt: -1 });

    return bookings;
};

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

    if (userRole === "admin") {
        // Admin can override any status
    } else if (userRole === "caregiver" && booking.caregiverId.userId._id.toString() !== userId.toString()) {
        throw new Error("Unauthorized");
    } else if (userRole === "user" && booking.userId._id.toString() !== userId.toString()) {
        throw new Error("Unauthorized");
    }

    booking.status = status;

    if (status === "rejected") {
        booking.rejectionReason = reason;
    }

    if (status === "cancelled") {
        booking.cancellationReason = reason;
        booking.cancelledBy = userRole;
        booking.cancelledAt = new Date();
    }

    if (status === "in-progress") {
        booking.completedAt = undefined;
    }

    if (status === "completed") {
        booking.completedAt = new Date();
        await Caregiver.findByIdAndUpdate(booking.caregiverId._id, {
            $inc: { totalBookings: 1 },
        });
    }

    await booking.save();

    if (status === "in-progress") {
        await createNotification(
            booking.userId._id,
            "booking_started",
            "Service Started",
            `Your care service with ${booking.caregiverId.userId.name} has started.`,
            "/user/bookings",
            { bookingId: booking._id }
        );
    }

    if (status === "accepted") {
        await createNotification(
            booking.userId._id,
            "booking_accepted",
            "Booking Accepted",
            `Your booking has been accepted by ${booking.caregiverId.userId.name}`,
            "/user/bookings"
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

export const getBookingById = async (bookingId) => {
    const booking = await Booking.findById(bookingId)
        .populate("userId", "name email phone profileImage")
        .populate({
            path: "caregiverId",
            populate: { path: "userId", select: "name email phone profileImage" },
        })
        .populate("serviceId", "title description price");

    if (!booking) {
        throw new Error("Booking not found");
    }

    return booking;
};

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
        .populate("serviceId", "title price")
        .sort({ createdAt: -1 });

    return bookings;
};

export const deleteBooking = async (bookingId) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new Error("Booking not found");
    }

    // Only allow deletion if it's not completed or if admin forces it?
    // Usually admin can delete any booking, let's just delete it.
    await Booking.findByIdAndDelete(bookingId);
    return booking;
};
