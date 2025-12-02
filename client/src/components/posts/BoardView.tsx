import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import PostCard from './PostCard';
import { Post } from '@/types/post.types';

interface BoardViewProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ posts, onEdit, onDelete }) => {
  // Ensure posts is always an array
  const postsArray = Array.isArray(posts) ? posts : [];

  if (postsArray.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Box sx={{ fontSize: '48px', color: 'grey.400', mb: 2 }}>📝</Box>
        <Typography variant="h6" color="textSecondary">
          No posts found
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {postsArray.map((post) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
          <PostCard post={post} onEdit={onEdit} onDelete={onDelete} />
        </Grid>
      ))}
    </Grid>
  );
};

export default BoardView;