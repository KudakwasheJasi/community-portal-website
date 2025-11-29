import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Box,
  Skeleton,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  useTheme,
  TablePagination,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { Post, PostStatus } from '@/types/post.types';

interface PostListProps {
  posts: Post[];
  onEdit?: (post: Post) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onSort?: (field: keyof Post) => void;
  sortBy?: keyof Post;
  sortDirection?: 'asc' | 'desc';
  loading?: boolean;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  totalCount?: number; // Add totalCount to props
}

const PostList: React.FC<PostListProps> = ({
  posts = [],
  onEdit,
  onDelete,
  onView,
  onSort,
  sortBy,
  sortDirection = 'asc',
  loading = false,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  totalCount = 0,
}) => {
  const theme = useTheme();

  const handleSort = (field: keyof Post) => {
    onSort?.(field);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange?.(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
  };

  const renderLoadingRows = () => {
    return Array(rowsPerPage)
      .fill(0)
      .map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton variant="text" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="80%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="60%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={100} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={100} />
          </TableCell>
          <TableCell>
            <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
            <Skeleton variant="text" width={80} />
          </TableCell>
        </TableRow>
    ));
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'title'} // Assuming 'title' is a sortable field
                  direction={sortBy === 'title' ? sortDirection : 'asc'} // Default to 'asc' if not sorted by 'title'
                  onClick={() => handleSort('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'status'} // Assuming 'status' is a sortable field
                  direction={sortBy === 'status' ? sortDirection : 'asc'} // Default to 'asc' if not sorted by 'status'
                  onClick={() => handleSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'date'} // Assuming 'date' is a sortable field
                  direction={sortBy === 'date' ? sortDirection : 'desc'} // Default to 'desc' if not sorted by 'date'
                  onClick={() => handleSort('date')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              renderLoadingRows()
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" maxWidth={200}>
                      <Avatar
                        src={post.imageUrl}
                        alt={post.title}
                        variant="rounded"
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      {post.title}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box 
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis', // Ensure ellipsis for overflow
                        maxWidth: 300
                      }}
                    >
                      {post.description}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: theme.palette.primary.main }}>
                        {post.author?.username?.[0]?.toUpperCase()}
                      </Avatar>
                      {post.author?.username}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexWrap="wrap" gap={0.5} maxWidth={150}>
                      {post.tags?.slice(0, 2).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag.name}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {post.tags && post.tags.length > 2 && (
                        <Chip 
                          label={`+${post.tags.length - 2}`} 
                          size="small"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={post.status}
                      size="small"
                      color={
                        post.status === PostStatus.PUBLISHED ? 'success' :
                        post.status === PostStatus.DRAFT ? 'warning' : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
 {post.date ? new Date(post.date).toLocaleDateString() : 'No date'}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Post">
                        <IconButton size="small" onClick={() => onView?.(post.id)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Post">
                        <IconButton size="small" onClick={() => onEdit?.(post)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Post">
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default PostList;
