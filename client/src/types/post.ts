export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  isFeatured?: boolean;
  tags?: string[];
  status: 'published' | 'draft' | 'archived';
  author: string;
  views: number;
}

export interface PostFormData {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  status?: 'published' | 'draft' | 'archived';
}
