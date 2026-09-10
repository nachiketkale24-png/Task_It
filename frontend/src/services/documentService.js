import api from './api';

export const getDocuments = (type = 'All') =>
  api.get('/documents', { params: type !== 'All' ? { type } : {} });

export const getDocument = (id) => api.get(`/documents/${id}`);

export const deleteDocument = (id) => api.delete(`/documents/${id}`);

export const uploadDocument = (formData) =>
  api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
