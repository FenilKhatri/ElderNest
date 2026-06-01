import http from "../../../lib/axios";

export const createCareNote = (data) => http.post("/care-notes", data);
export const updateCareNote = (id, data) => http.patch(`/care-notes/${id}`, data);
export const getBookingCareNotes = (bookingId) => http.get(`/care-notes/booking/${bookingId}`);
export const getMyCareNotes = () => http.get("/care-notes/my");
