import { useAuthStore } from "@stores/authStore";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: apiUrl, // change this
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
        // console.log(token);

        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.setState({
                token: null,
                isAuthenticated: false,
            });
        }

        return Promise.reject(error);
    }
);