import http from "./axios";

export const register = async (payload) => {
    const res = await http.post("/auth/register", payload);
    return res?.data;
};

export const login = async (payload) => {
    const res = await http.post("/auth/login", payload);
    return res?.data;
};