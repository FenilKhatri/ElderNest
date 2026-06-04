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

export const forgotPassword = (email, captchaToken) => {
    return http.post("/auth/forgot-password", { email, captchaToken });
};

export const validateResetToken = (token) => {
    return http.get(`/auth/validate-reset-token?token=${token}`);
};

export const resetPassword = (token, password) => {
    return http.post("/auth/reset-password", { token, password });
};