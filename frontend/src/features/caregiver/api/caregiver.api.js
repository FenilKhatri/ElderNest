import http from "../../../lib/axios";

export const register = (payload) => {
    return http.post("/auth/caregiver-register", payload);
};

export const login = (payload) => {
    return http.post("/auth/caregiver-login", payload);
};