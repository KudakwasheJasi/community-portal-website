import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Button,
  IconButton,
} from '@mui/material';
import {
  MoreHoriz,
  FavoriteBorder,
  ChatBubbleOutline,
  BookmarkBorder,
} from '@mui/icons-material';
import { Post } from '@/services/posts.service';

interface PostCardProps {
  data: Post;
}

const PostCard: React.FC<PostCardProps> = ({ data }) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
              {data.author?.username ? data.author.username.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {data.author?.username || 'Unknown Author'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {data.date ? new Date(data.date as string).toLocaleDateString() : 'No date'}
              </Typography>
            </Box>
          </Stack>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreHoriz />
          </IconButton>
        </Stack>

        <Typography variant="body2" color="text.primary" sx={{ mb: 2, lineHeight: 1.6 }}>
          {data.description}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2}>
            <Button
              size="small"
              startIcon={<FavoriteBorder sx={{ fontSize: 18 }} />}
              sx={{ color: 'text.secondary', minWidth: 0, px: 1, '&:hover': { color: 'error.main' } }}
            >
              {data.viewCount}
            </Button>
            <Button
              size="small"
              startIcon={<ChatBubbleOutline sx={{ fontSize: 18 }} />}
              sx={{ color: 'text.secondary', minWidth: 0, px: 1, '&:hover': { color: 'primary.main' } }}
            >
              0
            </Button>
          </Stack>
          <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            <BookmarkBorder sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PostCard;