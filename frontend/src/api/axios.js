import axios from "axios";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
    withCredentials: true,
});

http.interceptors.response.use(
    (res) => res?.data,
    (error) => {
        const message = error?.response?.data?.message || error?.message || "Something went wrong!";
        return Promise.reject({ ...error, message });
    },
);

export default http;