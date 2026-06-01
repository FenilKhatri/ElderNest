import http from "../../../lib/axios";

export const submitComplaint = (data) => http.post("/complaints", data);
export const getMyComplaints = () => http.get("/complaints/my");
export const getAllComplaints = (params = {}) => http.get("/complaints", { params });
export const updateComplaintStatus = (id, status, adminNotes) =>
  http.patch(`/complaints/${id}/status`, { status, adminNotes });
