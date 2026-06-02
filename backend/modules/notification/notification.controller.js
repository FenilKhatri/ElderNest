import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse } from "../../common/utils/responseHandler.utils.js";
import * as notificationService from "../../common/services/notification.service.js";

// Get user notifications
export const getNotifications = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const notifications = await notificationService.getUserNotifications(
        req.user.id,
        limit ? parseInt(limit) : 50
    );
    return successResponse(res, 200, "Notifications fetched", { notifications });
});

// Mark notification as read
export const markAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id, req.user.id);
    return successResponse(res, 200, "Notification marked as read", { notification });
});

// Mark all as read
export const markAllAsRead = asyncHandler(async (req, res) => {
    await notificationService.markAllAsRead(req.user.id);
    return successResponse(res, 200, "All notifications marked as read");
});

// Get unread count
export const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await notificationService.getUnreadCount(req.user.id);
    return successResponse(res, 200, "Unread count fetched", { count });
});

// Delete notification
export const deleteNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await notificationService.deleteNotification(id, req.user.id);
    return successResponse(res, 200, "Notification deleted successfully");
});

// Delete all notifications
export const deleteAllNotifications = asyncHandler(async (req, res) => {
    await notificationService.deleteAllNotifications(req.user.id);
    return successResponse(res, 200, "All notifications deleted successfully");
});
