import http from "../../../lib/axios";

// Get all caregivers (public)
export const getAllCaregivers = (filters = {}) => {
  return http.get("/caregivers", { params: filters });
};

// Get caregiver by ID (public)
export const getCaregiverById = (id) => {
  return http.get(`/caregivers/${id}`);
};

// Get my profile (caregiver)
export const getMyProfile = () => {
  return http.get("/caregivers/profile/me");
};

// Complete profile (caregiver)
export const completeProfile = (data) => {
  return http.post("/caregivers/profile/complete", data);
};

// Update availability (caregiver)
export const updateAvailability = (availability) => {
  return http.patch("/caregivers/availability", { availability });
};
