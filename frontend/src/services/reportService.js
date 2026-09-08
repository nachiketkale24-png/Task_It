import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/reports';

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const getProjectReport = () =>
    axios.get(`${API_BASE}/projects`, getAuthHeaders());

export const getTeamReport = () =>
    axios.get(`${API_BASE}/teams`, getAuthHeaders());

export const getInternReport = () =>
    axios.get(`${API_BASE}/interns`, getAuthHeaders());

export const getMonthlyReport = (month) =>
    axios.get(`${API_BASE}/monthly${month ? `?month=${month}` : ''}`, getAuthHeaders());

export const getCompletedTasksReport = () =>
    axios.get(`${API_BASE}/completed-tasks`, getAuthHeaders());

export const getDelayedTasksReport = () =>
    axios.get(`${API_BASE}/delayed-tasks`, getAuthHeaders());

// ── Export helpers ──────────────────────────────────────────────────────────
const downloadBlob = async (url, filename) => {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Export failed');
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
};

export const exportReport = async (reportKey, exportType, month = null) => {
    const endpoints = {
        projects: `${API_BASE}/projects`,
        teams: `${API_BASE}/teams`,
        interns: `${API_BASE}/interns`,
        monthly: `${API_BASE}/monthly`,
        completedTasks: `${API_BASE}/completed-tasks`,
        delayedTasks: `${API_BASE}/delayed-tasks`,
    };

    const ext = exportType === 'pdf' ? 'pdf' : 'xlsx';
    let url = `${endpoints[reportKey]}?export=${exportType}`;
    if (reportKey === 'monthly' && month) url += `&month=${month}`;

    await downloadBlob(url, `${reportKey}_report.${ext}`);
};
