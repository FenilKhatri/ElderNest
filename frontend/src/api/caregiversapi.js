import http from "./axios";

export const register = (payload) => {
    return http.post("/caregiver/auth/register", payload);
};

export const login = (payload) => {
    return http.post("/caregiver/auth/login", payload);
};