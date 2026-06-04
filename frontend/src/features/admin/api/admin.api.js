import http from "../../../lib/axios";
// DASHBOARD STATS
export const getDashboardStats = (timeframe = "last30") => {
  return http.get("/admin/dashboard/stats", { params: { timeframe } });
};
// SETTINGS
export const getSettings = () => {
  return http.get("/settings");
};

export const updateSettings = (data) => {
  return http.patch("/settings", data);
};
// USER MANAGEMENT
export const getAllUsers = (role = null, filters = {}) => {
  const params = role ? { role, ...filters } : { ...filters };
  return http.get("/admin/users", { params });
};

export const getUserById = (id) => {
  return http.get(`/auth/me`); 
};

export const deleteUser = (id) => {
  return http.delete(`/admin/users/${id}`);
};

// CAREGIVER MANAGEMENT
// Pending caregiver registrations
export const getPendingCaregivers = () => {
  return http.get("/admin/caregivers/pending");
};

export const approveCaregiverRegistration = (userId) => {
  return http.patch(`/admin/caregivers/${userId}/approve`);
};

export const rejectCaregiverRegistration = (userId, reason) => {
  return http.patch(`/admin/caregivers/${userId}/reject`, { reason });
};

// Pending caregiver profiles
export const getPendingProfiles = () => {
  return http.get("/admin/profiles/pending");
};

export const approveCaregiverProfile = (caregiverId) => {
  return http.patch(`/admin/profiles/${caregiverId}/approve`);
};

export const rejectCaregiverProfile = (caregiverId, feedback) => {
  return http.patch(`/admin/profiles/${caregiverId}/reject`, { feedback });
};

// Get all caregivers (public endpoint but useful for admin)
export const getAllCaregivers = (filters = {}) => {
  return http.get("/caregivers", { params: filters });
};

// Get caregiver by user ID
export const getCaregiverByUserId = (userId) => {
  return http.get(`/admin/caregivers/user/${userId}`);
};

// Get caregiver by caregiver document ID
export const getCaregiverByCaregiverId = (caregiverId) => {
  return http.get(`/admin/caregivers/by-id/${caregiverId}`);
};
// SERVICE MANAGEMENT
export const getAllServices = (filters = {}) => {
  return http.get("/services", { params: { drafts: "all", ...filters } });
};

export const getServiceById = (id) => {
  return http.get(`/services/${id}`);
};

export const createService = (data) => {
  return http.post("/services", data);
};

export const updateService = (id, data) => {
  return http.patch(`/services/${id}`, data);
};

export const deleteService = (id) => {
  return http.delete(`/services/${id}`);
};
// BOOKING MANAGEMENT
export const getAllBookings = (filters = {}) => {
  return http.get("/bookings/admin/all", { params: filters });
};

export const getBookingById = (id) => {
  return http.get(`/bookings/${id}`);
};

export const updateBookingStatus = (id, status, reason = null) => {
  const payload = { status };
  if (reason) {
    if (status === "rejected") payload.rejectionReason = reason;
    if (status === "cancelled") payload.cancellationReason = reason;
  }
  return http.patch(`/bookings/${id}/status`, payload);
};

export const deleteBooking = (id) => {
  return http.delete(`/bookings/${id}`);
};
// CONTACT/COMPLAINT MANAGEMENT
export const getAllContacts = (status = null) => {
  const params = status ? { status } : {};
  return http.get("/admin/contacts", { params });
};

export const updateContactStatus = (contactId, status, adminNotes = null) => {
  return http.patch(`/admin/contacts/${contactId}/status`, { status, adminNotes });
};
// NOTIFICATION MANAGEMENT
export const getNewsletterSubscribers = () => {
  return http.get("/newsletter/subscribers");
};

export const getNotifications = (limit = 50) => {
  return http.get("/notifications", { params: { limit } });
};

export const getUnreadCount = () => {
  return http.get("/notifications/unread-count");
};

export const markNotificationAsRead = (id) => {
  return http.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = () => {
  return http.patch("/notifications/read-all");
};

export const deleteNotification = (id) => {
  return http.delete(`/notifications/${id}`);
};

export const deleteAllNotifications = () => {
  return http.delete("/notifications");
};
// REVIEW MANAGEMENT
export const getCaregiverReviews = (caregiverId) => {
  return http.get(`/reviews/caregiver/${caregiverId}`);
};
// BLOG MANAGEMENT
export const getAllBlogs = (filters = {}) => {
  return http.get("/blogs", { params: { all: true, ...filters } });
};

export const getBlogById = (id) => {
  return http.get(`/blogs/${id}`);
};

export const createBlog = (data) => {
  return http.post("/blogs", data);
};

export const updateBlog = (id, data) => {
  return http.patch(`/blogs/${id}`, data);
};

export const deleteBlog = (id) => {
  return http.delete(`/blogs/${id}`);
};
// ANALYTICS & CAREGIVER ACTIONS
export const getAnalytics = () => http.get("/admin/analytics");

export const suspendCaregiver = (userId, suspend = true) =>
  http.patch(`/admin/caregivers/${userId}/suspend`, { suspend });

export const getCaregiverVerificationDetail = (caregiverId) =>
  http.get(`/admin/caregivers/${caregiverId}/verification`);

export const reviewCaregiverVerification = (caregiverId, action, feedback = "") =>
  http.patch(`/admin/caregivers/${caregiverId}/verification`, { action, feedback });
