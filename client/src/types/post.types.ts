export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  UNLISTED = 'UNLISTED',
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  images?: string[];
  status: PostStatus;
  visibility: PostVisibility;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author: User;
  categories?: Category[];
  tags?: Tag[];
  // Legacy fields for backward compatibility
  imageUrl?: string;
  date?: string;
  authorName?: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  excerpt?: string;
  status?: PostStatus;
  visibility?: PostVisibility;
  categoryIds?: string[];
  tagIds?: string[];
}

export interface UpdatePostDto extends Partial<CreatePostDto> {
  id: string;
}

export interface PostQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PostStatus;
  visibility?: PostVisibility;
  authorId?: string;
  categoryId?: string;
  tagId?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}
