import axios from 'axios';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') + '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Post {
  id: string;
  title: string;
  content: string;
  featuredImage?: string;
  status: 'published' | 'draft' | 'archived';
  viewCount: number;
  author: {
    id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  // Legacy fields for backward compatibility
  description?: string;
  imageUrl?: string;
  date?: string;
  views?: number;
  tags?: string[];
}

export interface CreatePostData {
  title: string;
  content: string;
  status?: 'published' | 'draft' | 'archived';
  // For file upload
  file?: File;
}

export interface UpdatePostData extends CreatePostData {
  id?: string;
}

export interface PostQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const postsService = {
  async getAll(params?: PostQueryParams): Promise<Post[]> {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  async getById(id: string): Promise<Post> {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  async create(data: CreatePostData, file?: File): Promise<Post> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.status) formData.append('status', data.status);
    if (file) formData.append('file', file);

    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async update(id: string, data: UpdatePostData, file?: File): Promise<Post> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.status) formData.append('status', data.status);
    if (file) formData.append('file', file);

    const response = await api.put(`/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },
};

export default postsService;