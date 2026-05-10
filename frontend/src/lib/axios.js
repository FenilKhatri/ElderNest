import axios from "axios";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    withCredentials: true,
});

http.interceptors.response.use(
    (res) => res?.data,
    (error) => {
        const status = error?.response?.status;
        const url = error?.config?.url;
        if (
            status === 401 &&
            url?.includes("/auth/me")
        ) {
            return Promise.reject(error);
        }
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong!";
        return Promise.reject({
            ...error,
            message,
        });
    }
);

export default http;