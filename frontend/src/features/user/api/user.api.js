import http from "../../../lib/axios";

// Update user profile
export const updateProfile = (data) => {
  return http.patch("/users/profile", data);
};

export const setPassword = (password) => {
  return http.patch("/users/set-password", { password });
};

export const updatePassword = (currentPassword, newPassword) => {
  return http.patch("/users/update-password", { currentPassword, newPassword });
};