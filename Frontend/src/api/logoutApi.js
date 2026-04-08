import http from "./axios"

export const logout = async () => {
    const res = await http.post("/auth/logout");
    return res?.data;
};