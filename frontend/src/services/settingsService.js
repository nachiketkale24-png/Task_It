import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const getProfile = () => API.get("/settings/profile");
export const updateProfile = (data) => API.put("/settings/profile", data);
export const changePassword = (data) => API.put("/settings/change-password", data);
export const getNotificationPrefs = () => API.get("/settings/notifications");
export const updateNotificationPrefs = (data) => API.put("/settings/notifications", data);
