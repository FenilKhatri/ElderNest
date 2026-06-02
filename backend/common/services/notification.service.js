import Notification from "../../modules/notification/notification.model.js";

// Create Notification
export const createNotification = async (userId, type, title, message, link = null, metadata = {}) => {
    try {
        const notification = await Notification.create({
            userId,
            type,
            title,
            message,
            link,
            metadata,
        });
        return notification;
    } catch (error) {
        console.error("Notification creation failed:", error);
        throw error;
    }
};

// Get User Notifications
export const getUserNotifications = async (userId, limit = 50) => {
    try {
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit);
        return notifications;
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        throw error;
    }
};

// Mark as Read
export const markAsRead = async (notificationId, userId) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { isRead: true },
            { new: true }
        );
        return notification;
    } catch (error) {
        console.error("Failed to mark notification as read:", error);
        throw error;
    }
};

// Mark All as Read
export const markAllAsRead = async (userId) => {
    try {
        await Notification.updateMany(
            { userId, isRead: false },
            { isRead: true }
        );
        return { success: true };
    } catch (error) {
        console.error("Failed to mark all as read:", error);
        throw error;
    }
};

// Get Unread Count
export const getUnreadCount = async (userId) => {
    try {
        const count = await Notification.countDocuments({ userId, isRead: false });
        return count;
    } catch (error) {
        console.error("Failed to get unread count:", error);
        throw error;
    }
};

// Delete Notification
export const deleteNotification = async (notificationId, userId) => {
    try {
        await Notification.findOneAndDelete({ _id: notificationId, userId });
        return { success: true };
    } catch (error) {
        console.error("Failed to delete notification:", error);
        throw error;
    }
};

// Delete All Notifications
export const deleteAllNotifications = async (userId) => {
    try {
        await Notification.deleteMany({ userId });
        return { success: true };
    } catch (error) {
        console.error("Failed to delete all notifications:", error);
        throw error;
    }
};

// Notification Templates
export const notificationTemplates = {
    caregiverApproved: {
        type: "caregiver_approved",
        title: "Account Approved!",
        message: "Your caregiver account has been approved. You can now complete your profile.",
        link: "/caregiver/profile/complete",
    },
    caregiverRejected: {
        type: "caregiver_rejected",
        title: "Registration Update",
        message: "Your caregiver registration could not be approved at this time.",
        link: null,
    },
    profileApproved: {
        type: "caregiver_approved",
        title: "Profile Approved!",
        message: "Your profile is now live and visible to users.",
        link: "/caregiver/dashboard",
    },
    bookingCreated: {
        type: "booking_created",
        title: "New Booking Request",
        message: "You have received a new booking request.",
        link: "/caregiver/bookings",
    },
    bookingAccepted: {
        type: "booking_accepted",
        title: "Booking Accepted",
        message: "Your booking has been accepted by the caregiver.",
        link: "/user/bookings",
    },
    bookingRejected: {
        type: "booking_rejected",
        title: "Booking Update",
        message: "Your booking request could not be accepted.",
        link: "/user/bookings",
    },
    bookingCompleted: {
        type: "booking_completed",
        title: "Booking Completed",
        message: "Your booking has been completed. Please leave a review.",
        link: "/user/bookings",
    },
};
