import http from "../../../lib/axios";

export const getAllCaregivers = (filters = {}) => {
  return http.get("/caregivers", { params: filters });
};

export const getCaregiverById = (id) => {
  return http.get(`/caregivers/${id}`);
};

export const getMyProfile = () => {
  return http.get("/caregivers/profile/me");
};

export const completeProfile = (data) => {
  return http.post("/caregivers/profile/complete", data);
};

export const updateProfile = (data) => {
  return http.patch("/caregivers/profile", data);
};

export const updateAvailability = (availability) => {
  return http.patch("/caregivers/availability", { availability });
};

export const getOnboardingStatus = () => {
  return http.get("/caregivers/onboarding/status");
};

export const submitVerification = (data) => {
  return http.post("/caregivers/verification/submit", data);
};

export const getCaregiverDashboardStats = () => {
  return http.get("/caregivers/dashboard");
};
