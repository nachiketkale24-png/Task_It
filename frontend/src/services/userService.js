import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const getUsers = () => API.get("/users");
export const getUser = (id) => API.get(`/users/${id}`);
export const createUser = (data) => API.post("/users", data);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const assignRole = (id, role) => API.put(`/users/${id}/role`, { role });
export const toggleActivate = (id) => API.put(`/users/${id}/deactivate`);
