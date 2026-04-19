import http from "./axios";

export const googleAuthApi = (payload) => {
    return http.post("/auth/google", payload);
};