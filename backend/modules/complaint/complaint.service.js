import Complaint from "./complaint.model.js";
import { createNotification } from "../../common/services/notification.service.js";
import Booking from "../booking/booking.model.js";

export const createComplaint = async (userId, data) => {
    let internalBookingId = undefined;
    if (data.bookingId && data.bookingId.trim()) {
        const booking = await Booking.findOne({ bookingId: data.bookingId });
        if (booking) {
            internalBookingId = booking._id;
        } else {
            const isMongoId = /^[0-9a-fA-F]{24}$/.test(data.bookingId);
            internalBookingId = isMongoId ? data.bookingId : undefined;
        }
    }
    return Complaint.create({ ...data, userId, type: data.type || "user", bookingId: internalBookingId });
};

export const getMyComplaints = async (userId) => {
    return Complaint.find({ userId }).sort({ createdAt: -1 });
};

export const getAllComplaints = async (filters = {}) => {
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;

    return Complaint.find(query)
        .populate("userId", "name email role")
        .populate("bookingId", "bookingId patientName status")
        .populate("resolvedBy", "name email")
        .sort({ createdAt: -1 });
};

export const updateComplaintStatus = async (complaintId, adminId, status, adminNotes = null) => {
    const complaint = await Complaint.findById(complaintId).populate("userId", "name email");
    if (!complaint) {
        throw new Error("Complaint not found");
    }

    complaint.status = status;
    if (adminNotes) complaint.adminNotes = adminNotes;

    if (status === "resolved" || status === "closed") {
        complaint.resolvedBy = adminId;
        complaint.resolvedAt = new Date();

        await createNotification(
            complaint.userId._id,
            "complaint_resolved",
            "Complaint Resolved",
            `Your complaint "${complaint.subject}" has been marked as ${status}.`,
            "/user/complaints",
            { complaintId: complaint._id }
        );
    }

    await complaint.save();
    return complaint;
};
