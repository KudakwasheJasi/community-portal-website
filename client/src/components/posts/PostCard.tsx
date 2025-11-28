import React from 'react';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  useTheme,
  Skeleton
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  loading?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onEdit,
  onDelete,
  onView,
  loading = false
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Skeleton variant="rectangular" height={140} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Skeleton />
          <Skeleton width="60%" />
          <Skeleton width="80%" />
        </CardContent>
        <CardActions>
          <Skeleton width="100%" height={36} />
        </CardActions>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={() => onView?.(post.id)}>
        <CardMedia
          component="img"
          height="140"
          image={post.imageUrl}
          alt={post.title}
          sx={{
            objectFit: 'cover',
            backgroundColor: theme.palette.grey[200],
            minHeight: 140
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Chip 
              label={post.status} 
              size="small" 
              color={
                post.status === 'published' ? 'success' : 
                post.status === 'draft' ? 'warning' : 'default'
              }
            />
            <Typography variant="caption" color="text.secondary">
              {new Date(post.date).toLocaleDateString()}
            </Typography>
          </Box>
          <Typography gutterBottom variant="h6" component="h3" noWrap>
            {post.title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {post.description}
          </Typography>
          <Box mt={2} display="flex" flexWrap="wrap" gap={0.5}>
            {post.tags?.map((tag) => (
              <Chip 
                key={tag} 
                label={tag} 
                size="small" 
                variant="outlined"
              />
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
            {post.author?.[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            {post.author}
          </Typography>
        </Box>
        <Box>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => onView?.(post.id)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit?.(post)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => onDelete?.(post.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton size="small">
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

export default PostCard;
