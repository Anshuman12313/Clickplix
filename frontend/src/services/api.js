
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("access_token");

        console.log(
            "API REQUEST:",
            config.method?.toUpperCase(),
            config.url
        );

        console.log(
            "TOKEN:",
            token
        );

        if (token) {

            config.headers = config.headers || {};

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export default api;

