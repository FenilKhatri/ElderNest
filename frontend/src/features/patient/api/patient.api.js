import http from "../../../lib/axios";

export const getMyPatients = () => http.get("/patients");
export const createPatient = (data) => http.post("/patients", data);
export const updatePatient = (id, data) => http.patch(`/patients/${id}`, data);
export const deletePatient = (id) => http.delete(`/patients/${id}`);
