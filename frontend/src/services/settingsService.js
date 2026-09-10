import api from "./api";

export const getProfile = () => api.get("/settings/profile");
export const updateProfile = (data) => api.put("/settings/profile", data);
export const changePassword = (data) => api.put("/settings/change-password", data);
export const getNotificationPrefs = () => api.get("/settings/notifications");
export const updateNotificationPrefs = (data) => api.put("/settings/notifications", data);
