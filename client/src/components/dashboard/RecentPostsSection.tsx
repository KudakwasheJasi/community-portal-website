import React from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';
import PostCard from '../posts/PostCard';
import { Post } from '@/services/posts.service';

interface RecentPostsSectionProps {
  posts: Post[];
}

const RecentPostsSection: React.FC<RecentPostsSectionProps> = ({ posts }) => {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} px={0.5}>
        <Typography variant="h6">Recent Posts</Typography>
        <Button size="small" sx={{ fontWeight: 600 }}>See All</Button>
      </Stack>
      <Box
        className="no-scrollbar"
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 1,
          mx: -2,
          px: 2,
        }}
      >
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </Box>
    </Box>
  );
};

export default RecentPostsSection;