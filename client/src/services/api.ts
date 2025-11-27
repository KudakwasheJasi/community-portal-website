// src/services/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Assignment related API calls
export const getAssignments = async () => {
  const { data } = await api.get('/assignments');
  return data;
};

export const getAssignment = async (id) => {
  const { data } = await api.get(`/assignments/${id}`);
  return data;
};

// User related API calls
export const getUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

// Analytics
export const getAnalytics = async () => {
  const { data } = await api.get('/analytics/dashboard');
  return data;
};

export default api;