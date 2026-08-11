import api from "./api";

// Get all tasks
export const getTasks = async () => {
    const response = await api.get("/tasks");
    return response.data;
};

// Get single task details
export const getTask = async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
};

// Create a new task
export const createTask = async (taskData) => {
    const response = await api.post("/tasks", taskData);
    return response.data;
};

// Update a task
export const updateTask = async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
};

// Delete a task
export const deleteTask = async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
};

// Add a subtask (checklist item)
export const addSubtask = async (taskId, title) => {
    const response = await api.post(`/tasks/${taskId}/subtasks`, { title });
    return response.data;
};

// Toggle a subtask completion status
export const toggleSubtask = async (taskId, subtaskId, isCompleted) => {
    const response = await api.put(`/tasks/${taskId}/subtasks/${subtaskId}`, { isCompleted });
    return response.data;
};

// Delete a subtask
export const deleteSubtask = async (taskId, subtaskId) => {
    const response = await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
    return response.data;
};

// Add a comment to a task
export const addComment = async (taskId, text) => {
    const response = await api.post(`/tasks/${taskId}/comments`, { text });
    return response.data;
};

// Delete a comment from a task
export const deleteComment = async (taskId, commentId) => {
    const response = await api.delete(`/tasks/${taskId}/comments/${commentId}`);
    return response.data;
};

// Add an attachment link to a task
export const addAttachment = async (taskId, name, url) => {
    const response = await api.post(`/tasks/${taskId}/attachments`, { name, url });
    return response.data;
};

// Delete an attachment from a task
export const deleteAttachment = async (taskId, attachmentId) => {
    const response = await api.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
    return response.data;
};

// Get list of users (to populate assignee list)
export const getUsers = async () => {
    const response = await api.get("/auth/users");
    return response.data;
};
