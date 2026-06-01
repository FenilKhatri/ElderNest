import CareNote from "./careNote.model.js";
import Booking from "../booking/booking.model.js";
import Caregiver from "../caregiver/caregiver.model.js";
import { createNotification } from "../../common/services/notification.service.js";

export const createCareNote = async (caregiverUserId, data) => {
    const caregiver = await Caregiver.findOne({ userId: caregiverUserId });
    if (!caregiver) {
        throw new Error("Caregiver profile not found");
    }

    const booking = await Booking.findById(data.bookingId);
    if (!booking) {
        throw new Error("Booking not found");
    }
    if (booking.caregiverId.toString() !== caregiver._id.toString()) {
        throw new Error("Unauthorized");
    }
    if (!["accepted", "in-progress", "completed"].includes(booking.status)) {
        throw new Error("Cannot add care notes for this booking status");
    }

    const note = await CareNote.create({
        ...data,
        caregiverId: caregiver._id,
        userId: booking.userId,
    });

    await createNotification(
        booking.userId,
        "care_note_added",
        "New Care Note",
        "Your caregiver has added a new care note for your booking.",
        "/user/bookings",
        { bookingId: booking._id, careNoteId: note._id }
    );

    return note;
};

export const updateCareNote = async (noteId, caregiverUserId, data) => {
    const caregiver = await Caregiver.findOne({ userId: caregiverUserId });
    if (!caregiver) {
        throw new Error("Caregiver profile not found");
    }

    const note = await CareNote.findOneAndUpdate(
        { _id: noteId, caregiverId: caregiver._id },
        data,
        { new: true, runValidators: true }
    );
    if (!note) {
        throw new Error("Care note not found");
    }
    return note;
};

export const getCareNotesByBooking = async (bookingId, requesterId, requesterRole) => {
    const booking = await Booking.findById(bookingId).populate({
        path: "caregiverId",
        populate: { path: "userId", select: "_id" },
    });

    if (!booking) {
        throw new Error("Booking not found");
    }

    const isUser = booking.userId.toString() === requesterId;
    const isCaregiver = booking.caregiverId?.userId?._id?.toString() === requesterId;
    const isAdmin = requesterRole === "admin";

    if (!isUser && !isCaregiver && !isAdmin) {
        throw new Error("Unauthorized");
    }

    return CareNote.find({ bookingId }).sort({ createdAt: -1 });
};

export const getCaregiverCareNotes = async (caregiverUserId) => {
    const caregiver = await Caregiver.findOne({ userId: caregiverUserId });
    if (!caregiver) {
        throw new Error("Caregiver profile not found");
    }
    return CareNote.find({ caregiverId: caregiver._id })
        .populate("bookingId", "bookingId patientName bookingDate status")
        .sort({ createdAt: -1 });
};
