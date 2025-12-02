import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Stack,
  Avatar,
  IconButton,
} from '@mui/material';
import { Delete, Edit, Visibility, Message, AttachFile } from '@mui/icons-material';
import { Post } from '@/types/post.types';

interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    setLoading(true);
    await onDelete(post.id);
    setLoading(false);
  };

  // Format date
  const displayDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    : post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    : 'No date';

  // Use post's featuredImage if available, otherwise generate a default image URL
  // Ensure full URL for backend-hosted images
  const imageUrl = post.featuredImage
    ? (post.featuredImage.startsWith('/uploads/')
        ? `http://localhost:3000${post.featuredImage}`
        : post.featuredImage)
    : post.imageUrl || `https://picsum.photos/400/200?random=${encodeURIComponent(post.title)}`;

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return '#4caf50';
      case 'draft':
        return '#ff9800';
      case 'archived':
        return '#9e9e9e';
      default:
        return '#2196f3';
    }
  };

  return (
    <Card
      sx={{
        minWidth: 320,
        maxWidth: 320,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 4 },
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          height: 128,
          width: '100%',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
          }}
        />
        {/* Status badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: getStatusColor(post.status),
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.7rem',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          {post.status}
        </Box>
        {/* Action buttons - only show if handlers are provided */}
        {(onEdit || onDelete) && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              display: 'flex',
              gap: 0.5,
            }}
          >
            {onEdit && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEdit) onEdit(post);
                }}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                  width: 28,
                  height: 28,
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={loading}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                  width: 28,
                  height: 28,
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}
        <Box sx={{ position: 'absolute', bottom: 12, left: 12, right: 12, color: 'white' }}>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2} sx={{ mb: 0.5 }}>
            {post.title}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500 }}>
            {displayDate}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Visibility sx={{ fontSize: 14 }} />
            <Typography variant="caption" fontWeight={600}>
              {post.viewCount || 0}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Message sx={{ fontSize: 14 }} />
            <Typography variant="caption" fontWeight={600}>
              {post.commentCount || 0}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <AttachFile sx={{ fontSize: 14 }} />
            <Typography variant="caption" fontWeight={600}>
              {post.images?.length || 0}
            </Typography>
          </Stack>
        </Stack>
        <Avatar
          sx={{
            width: 24,
            height: 24,
            bgcolor: 'primary.main',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {(post.author?.username || post.authorName || 'U').charAt(0).toUpperCase()}
        </Avatar>
      </Box>
    </Card>
  );
};

export default PostCard;
