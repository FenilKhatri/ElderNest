import http from "../../../lib/axios";

// Dashboard stats
export const getDashboardStats = () => {
  return http.get("/admin/dashboard/stats");
};

// Caregiver registration approval
export const getPendingCaregivers = () => {
  return http.get("/admin/caregivers/pending");
};

export const approveCaregiverRegistration = (userId) => {
  return http.patch(`/admin/caregivers/${userId}/approve`);
};

export const rejectCaregiverRegistration = (userId, reason) => {
  return http.patch(`/admin/caregivers/${userId}/reject`, { reason });
};

// Caregiver profile approval
export const getPendingProfiles = () => {
  return http.get("/admin/profiles/pending");
};

export const approveCaregiverProfile = (caregiverId) => {
  return http.patch(`/admin/profiles/${caregiverId}/approve`);
};

export const rejectCaregiverProfile = (caregiverId, feedback) => {
  return http.patch(`/admin/profiles/${caregiverId}/reject`, { feedback });
};

// User management
export const getAllUsers = (role = null) => {
  const params = role ? { role } : {};
  return http.get("/admin/users", { params });
};

// Contact management
export const getAllContacts = (status = null) => {
  const params = status ? { status } : {};
  return http.get("/admin/contacts", { params });
};

export const updateContactStatus = (contactId, data) => {
  return http.patch(`/admin/contacts/${contactId}/status`, data);
};
