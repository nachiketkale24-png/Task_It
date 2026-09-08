import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const getLinkedProjects = () => API.get("/github/projects");
export const getAllProjects = () => API.get("/github/all-projects");
export const setProjectRepo = (projectId, githubRepo) =>
    API.put(`/github/projects/${projectId}/repo`, { githubRepo });
export const getRepoInfo = (url) =>
    API.get("/github/repo-info", { params: { url } });
