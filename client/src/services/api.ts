// src/services/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

// Auth related API calls
export const registerUser = async (userData: any) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const loginUser = async (credentials: any) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get('/auth/profile');
  return data;
};

// User related API calls
export const getUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

// Posts related API calls
export const getPosts = async () => {
  const { data } = await api.get('/posts');
  return data;
};

export const getPost = async (id: string | number) => {
  const { data } = await api.get(`/posts/${id}`);
  return data;
};

export const createPost = async (postData: any, file?: File) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('description', postData.description);
  if (file) {
    formData.append('file', file);
  }
  const { data } = await api.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

// Events related API calls (assuming similar structure)
export const getEvents = async () => {
  const { data } = await api.get('/events');
  return data;
};

export const registerForEvent = async (eventId: string | number) => {
  const { data } = await api.post(`/events/${eventId}/register`);
  return data;
};

export default api;
