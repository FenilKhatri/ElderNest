import Message from "./message.model.js";
import Booking from "../booking/booking.model.js";
import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import { createNotification } from "../../common/services/notification.service.js";

export const getMessages = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("caregiverId");
    if (!booking) {
        return errorResponse(res, 404, "Booking not found");
    }

    const isUser = booking.userId && booking.userId.toString() === req.user.id.toString();
    const caregiverUserId = booking.caregiverId?.userId || booking.caregiverId;
    const isCaregiver = caregiverUserId && caregiverUserId.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isUser && !isCaregiver && !isAdmin) {
        return errorResponse(res, 403, "Unauthorized access to messages");
    }

    const messages = await Message.find({ bookingId }).sort({ createdAt: 1 });
    
    // Mark as read
    await Message.updateMany(
        { bookingId, receiverId: req.user.id, isRead: false },
        { isRead: true }
    );

    return successResponse(res, 200, "Messages retrieved", { messages });
});

export const sendMessage = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
        return errorResponse(res, 400, "Message content is required");
    }

    const booking = await Booking.findById(bookingId).populate("caregiverId");
    if (!booking) {
        return errorResponse(res, 404, "Booking not found");
    }

    if (!["accepted", "in-progress"].includes(booking.status)) {
        return errorResponse(res, 400, "Messaging is only allowed for accepted or in-progress bookings");
    }

    let receiverId;
    const isUser = booking.userId && booking.userId.toString() === req.user.id.toString();
    const caregiverUserId = booking.caregiverId?.userId || booking.caregiverId;
    const isCaregiver = caregiverUserId && caregiverUserId.toString() === req.user.id.toString();

    if (isUser) {
        receiverId = caregiverUserId;
    } else if (isCaregiver) {
        receiverId = booking.userId;
    } else {
        return errorResponse(res, 403, "Unauthorized to send messages for this booking");
    }

    const message = await Message.create({
        bookingId,
        senderId: req.user.id,
        receiverId,
        content
    });

    await createNotification(
        receiverId,
        "general",
        "New Message",
        `You have a new message regarding booking ${booking.bookingId}`,
        isUser ? "/caregiver/bookings" : "/user/bookings"
    );

    return successResponse(res, 201, "Message sent", { message });
});
