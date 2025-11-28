export type PostStatus = 'published' | 'draft' | 'archived';

export interface Post {
  id: string;
  title: string;
  description: string;
  content?: string; // For rich text content
  imageUrl: string;
  date: string;
  isFeatured?: boolean;
  tags?: string[];
  status: PostStatus;
  author: string;
  views: number;
  category?: string; // New field for categories
  readTime?: number; // Estimated read time in minutes
  slug?: string; // For SEO-friendly URLs
}

export interface PostFormData {
  id?: string;
  title: string;
  description: string;
  content?: string;
  imageUrl: string;
  status?: PostStatus;
  tags?: string[];
  category?: string;
  isFeatured?: boolean;
  slug?: string;
}
