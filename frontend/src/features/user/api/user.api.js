import http from "../../../lib/axios";

// Update user profile
export const updateProfile = (data) => {
  return http.patch("/users/profile", data);
};

// Set password for OAuth users
export const setPassword = (password) => {
  return http.patch("/users/set-password", { password });
};