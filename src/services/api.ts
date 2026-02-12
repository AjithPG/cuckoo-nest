import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add interceptors if needed (e.g., for auth)
api.interceptors.request.use((config) => {
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
