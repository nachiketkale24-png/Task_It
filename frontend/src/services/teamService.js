import api from "./api";

// Get all teams
export const getTeams = async () => {
    const response = await api.get("/team");
    return response.data;
};

// Get single team
export const getTeam = async (id) => {
    const response = await api.get(`/team/${id}`);
    return response.data;
};

// Create team
export const createTeam = async (teamData) => {
    const response = await api.post("/team", teamData);
    return response.data;
};

// Update team
export const updateTeam = async (id, teamData) => {
    const response = await api.put(`/team/${id}`, teamData);
    return response.data;
};

// Delete team
export const deleteTeam = async (id) => {
    const response = await api.delete(`/team/${id}`);
    return response.data;
};

// Invite member
export const inviteMember = async (id, email) => {
    const response = await api.post(`/team/${id}/invite`, {
        email,
    });

    return response.data;
};

// Leave team
export const leaveTeam = async (id) => {
    const response = await api.delete(`/team/${id}/leave`);
    return response.data;
};

// Remove member
export const removeMember = async (teamId, userId) => {
    const response = await api.delete(
        `/team/${teamId}/member/${userId}`
    );

    return response.data;
};