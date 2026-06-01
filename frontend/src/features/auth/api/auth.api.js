import http from "../../../lib/axios";

export const register = (payload) => {
    return http.post("/auth/register", payload);
};

export const login = (payload) => {
    return http.post("/auth/login", payload);
};

export const loginAdmin = (payload) => {
    return http.post("/auth/admin-login", payload);
};

export const registerCaregiver = (payload) => {
    return http.post("/auth/caregiver-register", payload);
};

export const loginCaregiver = (payload) => {
    return http.post("/auth/caregiver-login", payload);
};

export const googleAuth = (token, role) => {
    return http.post("/auth/google", { token, role });
};

export const getMe = async () => {
    return await http.get("/auth/me");
};

export const logout = () => {
    return http.post("/auth/logout");
};