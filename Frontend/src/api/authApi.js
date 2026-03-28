import http from "./axios"

export const registerUser = async(payload) => {
    const res = await http.post("/auth/register", payload);
    return res.data;
};

export const loginUser = async (payload) => {
    const res = await http.post("/auth/login", payload);
    return res.data;
}