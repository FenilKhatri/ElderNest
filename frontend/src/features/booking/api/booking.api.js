import http from "../../../lib/axios";

// Create booking (user)
export const createBooking = (data) => {
  return http.post("/bookings/create", data);
};

// Get my bookings (user)
export const getUserBookings = (status = null) => {
  const params = status ? { status } : {};
  return http.get("/bookings/user/my-bookings", { params });
};

// Get caregiver bookings
export const getCaregiverBookings = (caregiverId, status = null) => {
  const params = status ? { status } : {};
  return http.get(`/bookings/caregiver/${caregiverId}`, { params });
};

// Get booking by ID
export const getBookingById = (id) => {
  return http.get(`/bookings/${id}`);
};

// Update booking status
export const updateBookingStatus = (id, data) => {
  return http.patch(`/bookings/${id}/status`, data);
};

// Get all bookings (admin)
export const getAllBookings = (filters = {}) => {
  return http.get("/bookings/admin/all", { params: filters });
};
