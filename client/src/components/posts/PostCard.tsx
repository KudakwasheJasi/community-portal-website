/**
    * @description      :
    * @author           : kudakwashe Ellijah
    * @group            :
    * @created          : 15/07/2025 - 17:02:33
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 15/07/2025
    * - Author          : kudakwashe Ellijah
    * - Modification    :
**/
import clsx from "clsx";
import React, { useState } from "react";
import {
  AttachFile,
  KeyboardArrowDown,
  KeyboardArrowUp,
  KeyboardDoubleArrowUp,
  Delete,
  Visibility,
  Message,
  List,
  Add,
} from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { Post } from "@/services/posts.service";

const STATUS_STYLES = {
  published: "text-green-600 bg-green-100",
  draft: "text-yellow-600 bg-yellow-100",
  archived: "text-gray-600 bg-gray-100",
};

const STATUS_ICONS = {
  published: <KeyboardDoubleArrowUp />,
  draft: <KeyboardArrowUp />,
  archived: <KeyboardArrowDown />,
};

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    setLoading(true);
    await onDelete(post.id);
    setLoading(false);
  };

  return (
    <div className='w-full h-fit bg-white dark:bg-[#10192d] shadow-md p-4 rounded dark:text-white'>
      <div className='w-full flex justify-between'>
        <div
          className={clsx(
            "flex flex-1 gap-1 items-center text-sm font-medium",
            STATUS_STYLES[post.status]
          )}
        >
          <span className='text-lg dark:text-white'>{STATUS_ICONS[post.status]}</span>
          <span className='uppercase dark:text-white'>{post.status}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => onEdit(post)}
            size="small"
            color="primary"
            variant="text"
            sx={{ minWidth: 'auto', px: 1 }}
          >
            Edit
          </Button>
          <IconButton
            onClick={handleDelete}
            disabled={loading}
            size="small"
            color="error"
            sx={{ p: 0.5 }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <h4 className='line-clamp-1 text-black dark:text-white'>{post.title}</h4>
      </div>
      <span className='text-sm text-gray-600'>
        {post.date ? new Date(post.date).toLocaleDateString() : 'No date'}
      </span>

      <div className='w-full border-t border-gray-200 my-2' />
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-3'>
          <div className='flex gap-1 items-center text-sm text-gray-600'>
            <Visibility />
            <span>{post.views}</span>
          </div>
          <div className='flex gap-1 items-center text-sm text-gray-600'>
            <Message />
            <span>0</span> {/* Placeholder for comments */}
          </div>
          <div className='flex gap-1 items-center text-sm text-gray-600'>
            <AttachFile />
            <span>0</span> {/* Placeholder for attachments */}
          </div>
        </div>

        <div className='flex flex-row-reverse'>
          <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
            {String(post.author || '').charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>

      <div className='py-4 border-t border-gray-200'>
        <p className='text-sm text-gray-600 dark:text-gray-300 line-clamp-2'>
          {post.description}
        </p>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className='flex flex-wrap gap-1 mt-2'>
          {post.tags.map((tag, index) => (
            <span key={index} className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
