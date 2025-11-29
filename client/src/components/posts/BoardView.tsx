/**
    * @description      :
    * @author           : kudakwashe Ellijah
    * @group            :
    * @created          : 21/07/2025 - 12:40:20
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 21/07/2025
    * - Author          : kudakwashe Ellijah
    * - Modification    :
**/
import React from "react";
import PostCard from "./PostCard";
import { Post } from "@/services/posts.service";

interface BoardViewProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ posts, onEdit, onDelete }) => {
  if (posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px', border: '2px dashed #ddd' }}>
        <div style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }}>📝</div>
        <h2>No posts found</h2>
      </div>
    );
  }

  return (
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10'>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default BoardView;