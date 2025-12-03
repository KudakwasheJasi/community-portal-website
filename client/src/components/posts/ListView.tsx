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
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { Post } from "@/types/post.types";

interface ListViewProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ posts, onEdit, onDelete }) => {
  // Ensure posts is always an array
  const postsArray = Array.isArray(posts) ? posts : [];

  const getStatusColor = (status: string): 'success' | 'warning' | 'default' => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Author</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 1.5, textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {postsArray.length > 0 ? (
              postsArray.map((post) => (
                <TableRow
                  key={post.id}
                  hover
                  sx={{
                    '&:last-child td': { borderBottom: 0 },
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <TableCell sx={{ py: 1.5 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 4,
                          overflow: 'hidden',
                          marginRight: 12,
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={post.imageUrl || 'https://picsum.photos/800/600'}
                          alt={post.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, lineHeight: 1.3 }}>
                          {post.title}
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: 'text.secondary',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {post.content}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Chip
                      label={post.status ? post.status.charAt(0).toUpperCase() + post.status.slice(1) : 'Draft'}
                      size="small"
                      color={getStatusColor(post.status || 'draft')}
                      variant="outlined"
                      sx={{
                        textTransform: 'capitalize',
                        height: 22,
                        fontSize: '0.7rem',
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src=""
                        alt={typeof post.author === 'object' && post.author?.name ? post.author.name : 'Unknown'}
                        sx={{ width: 24, height: 24, mr: 1, fontSize: '0.7rem' }}
                      >
                        {typeof post.author === 'object' && post.author?.name ? post.author.name.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                      <span>{typeof post.author === 'object' && post.author?.name ? post.author.name : 'Unknown Author'}</span>
                    </div>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <span style={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'No date'}
                    </span>
                  </TableCell>
                  <TableCell sx={{ py: 1.5, textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                      <Tooltip title="View">
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(post)}
                          sx={{ color: 'text.secondary' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => onDelete(post.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 4, textAlign: 'center' }}>
                  No posts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ListView;