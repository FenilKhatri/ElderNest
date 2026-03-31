import axios from "axios";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

http.interceptors.response.use(
    (res) => res,
    (error) => {
        const message = 
            error?.response?.data?.message || error?.message || "Something went wrong!";
        return Promise.reject({ ...error, message });
    }
);

export default http;