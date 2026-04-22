import http from "./axios"

export const logOut = async () => {
    return await http.post("/auth/logout", {});
};