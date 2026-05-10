import http from "../../../lib/axios";

export const logOut = async () => {
    return await http.post("/auth/logout", {});
};