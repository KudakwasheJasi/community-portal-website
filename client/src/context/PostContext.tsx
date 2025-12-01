import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import postsService, { CreatePostData, UpdatePostData } from '@/services/posts.service';
import { Post } from '@/types/post.types';

interface PostContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (data: CreatePostData, file?: File) => Promise<Post>;
  updatePost: (id: string, data: UpdatePostData, file?: File) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  clearError: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await postsService.getAll();
      setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      setPosts([]); // Ensure posts is always an array
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (data: CreatePostData, file?: File): Promise<Post> => {
    try {
      setError(null);
      const newPost = await postsService.create(data, file);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updatePost = async (id: string, data: UpdatePostData, file?: File): Promise<Post> => {
    try {
      setError(null);
      const updatedPost = await postsService.update(id, data, file);
      setPosts(prev => prev.map(post => post.id === id ? updatedPost : post));
      return updatedPost;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update post';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deletePost = async (id: string) => {
    try {
      setError(null);
      await postsService.delete(id);
      setPosts(prev => prev.filter(post => post.id !== id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const value = {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    clearError,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePosts = (): PostContextType => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

export default PostContext;
