import http from "../../../lib/axios";

// Get all services (public)
export const getAllServices = (filters = {}) => {
  return http.get("/services", { params: filters });
};

// Get service by ID (public)
export const getServiceById = (id) => {
  return http.get(`/services/${id}`);
};

// Create service (admin)
export const createService = (data) => {
  return http.post("/services", data);
};

// Update service (admin)
export const updateService = (id, data) => {
  return http.patch(`/services/${id}`, data);
};

// Delete service (admin)
export const deleteService = (id) => {
  return http.delete(`/services/${id}`);
};
