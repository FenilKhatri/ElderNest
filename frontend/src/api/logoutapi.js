import http from "./axios"

export const logOut = async () => {
    return res = await http.post("/auth/logout", {}, { withCredentials: true });
};