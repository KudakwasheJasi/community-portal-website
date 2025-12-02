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

import { Post as PostType, PostStatus, PostVisibility } from '@/types/post.types';

export type Post = PostType;

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

export interface PaginatedPostsResponse {
  items: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const postsService = {
  async getAll(params?: PostQueryParams): Promise<Post[]> {
    const response = await api.get('/posts', { params });
    const data = response.data as PaginatedPostsResponse;
    const posts = data.items || [];

    // Transform API response to match Post type
    return posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug || post.title.toLowerCase().replace(/\s+/g, '-'),
      content: post.content,
      excerpt: post.excerpt || post.description,
      featuredImage: post.featuredImage || post.imageUrl,
      images: post.images || [],
      status: post.status,
      visibility: post.visibility || PostVisibility.PUBLIC,
      viewCount: post.viewCount || post.views || 0,
      likeCount: post.likeCount || 0,
      commentCount: post.commentCount || 0,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt || post.date,
      updatedAt: post.updatedAt,
      author: post.author,
      categories: post.categories || [],
      tags: post.tags || [],
      // Legacy fields
      description: post.description,
      imageUrl: post.imageUrl,
      date: post.date,
      authorName: post.authorName,
    }));
  },

  async getAllPaginated(params?: PostQueryParams): Promise<PaginatedPostsResponse> {
    const response = await api.get('/posts', { params });
    return response.data as PaginatedPostsResponse;
  },

  async getById(id: string): Promise<Post> {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  async create(data: CreatePostData, imageUrl?: string): Promise<Post> {
    const payload = {
      title: data.title,
      content: data.content,
      status: data.status,
      imageUrl: imageUrl,
    };

    const response = await api.post('/posts', payload);
    return response.data;
  },

  async update(id: string, data: UpdatePostData, imageUrl?: string): Promise<Post> {
    const payload = {
      title: data.title,
      content: data.content,
      status: data.status,
      imageUrl: imageUrl,
    };

    const response = await api.put(`/posts/${id}`, payload);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },
};

export default postsService;