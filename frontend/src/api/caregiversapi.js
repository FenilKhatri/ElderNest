import http from "./axios";

export const register = (payload) => {
    return http.post("/auth/caregiver-register", payload);
};

export const login = (payload) => {
    return http.post("/auth/caregiver-login", payload);
};

export const getMe = async () => {
    const res = await http.get("/auth/caregiver-me");
    return res;
};