import http from "./axios";

export const register = (payload) => {
    return http.post("/auth/register", payload);
};

export const login = (payload) => {
    return http.post("/auth/login", payload);
};

export const getMe = async () => {
    const res = await http.get("/auth/me");
    return res.data;
};