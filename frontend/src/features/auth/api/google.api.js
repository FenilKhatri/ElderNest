import http from "../../../lib/axios";

export const googleAuthApi = (payload) => {
    return http.post("/auth/google", payload);
};