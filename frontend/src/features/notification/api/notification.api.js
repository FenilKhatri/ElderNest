import http from "../../../lib/axios";

// Get notifications
export const getNotifications = (limit = 50) => {
  return http.get("/notifications", { params: { limit } });
};

// Get unread count
export const getUnreadCount = () => {
  return http.get("/notifications/unread-count");
};

// Mark as read
export const markAsRead = (id) => {
  return http.patch(`/notifications/${id}/read`);
};

// Mark all as read
export const markAllAsRead = () => {
  return http.patch("/notifications/read-all");
};

// Delete notification
export const deleteNotification = (id) => {
  return http.delete(`/notifications/${id}`);
};
