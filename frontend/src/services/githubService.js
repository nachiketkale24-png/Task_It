import api from "./api";

export const getLinkedProjects = () => api.get("/github/projects");
export const getAllProjects = () => api.get("/github/all-projects");
export const setProjectRepo = (projectId, githubRepo) =>
    api.put(`/github/projects/${projectId}/repo`, { githubRepo });
export const getRepoInfo = (url, projectId) =>
    api.get("/github/repo-info", { params: { url, projectId } });
