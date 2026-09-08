import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getDocuments = (type = 'All') =>
  API.get('/documents', { params: type !== 'All' ? { type } : {} });

export const getDocument = (id) => API.get(`/documents/${id}`);

export const deleteDocument = (id) => API.delete(`/documents/${id}`);

export const uploadDocument = (formData) =>
  API.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
