import api from "./api";

export const getProjects = (params) => api.get("/projects", { params });

export const createProject = (data) => api.post("/projects", data);

export const updateProject = (id, data) => api.put(`/projects/${id}`, data);

export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const getProjectById = (id) => api.get(`/projects/${id}`);
