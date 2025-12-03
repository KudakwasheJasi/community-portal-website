import React, { useState } from 'react';
import Image from 'next/image';
import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { ViewList, GridView, Refresh } from '@mui/icons-material';
import MainDashboardLayout from '@/components/dashboard/MainDashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import CreateEditPostDialog from '@/components/posts/CreateEditPostDialog';
import BoardView from '@/components/posts/BoardView';
import ListView from '@/components/posts/ListView';
import { usePosts } from '@/context/PostContext';
import { Post } from '@/types/post.types';

type ViewMode = 'list' | 'board';

interface PostFormData {
  id?: string;
  title: string;
  description: string;
  status?: 'published' | 'draft' | 'archived';
  imageUrl?: string;
}

const PostsPage: React.FC = () => {
  return (
    <AuthGuard>
      <PostsPageContent />
    </AuthGuard>
  );
};

const PostsPageContent: React.FC = () => {
  const { posts, loading, error, createPost, updatePost, deletePost, fetchPosts, clearError } = usePosts();
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const activePostData = editingPostId ? (() => {
    const post = posts.find(p => p.id === editingPostId);
    return post ? {
      id: post.id,
      title: post.title,
      description: post.content || '',
      status: post.status.toLowerCase() as 'published' | 'draft' | 'archived'
    } : undefined;
  })() : undefined;

  const handleCreate = () => {
    setEditingPostId(null);
    setDialogOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPostId(post.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        clearError();
        await deletePost(id);
      } catch (err: unknown) {
        // Error is handled by context
      }
    }
  };

  const handleSave = async (data: PostFormData) => {
    try {
      clearError();
      if (data.id) {
        await updatePost(data.id, {
          title: data.title,
          content: data.description,
          status: data.status
        }, data.imageUrl);
      } else {
        await createPost({
          title: data.title,
          content: data.description,
          status: data.status
        }, data.imageUrl);
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      // Error is handled by context
    }
  };

  const handleRefresh = async () => {
    try {
      clearError();
      await fetchPosts();
    } catch (err: unknown) {
      // Error is handled by context
    }
  };

  return (
    <MainDashboardLayout title="Posts Management">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ mb: 3 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h3" component="h1" sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: '2.5rem'
            }}>
              Posts Management
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newValue) => newValue && setViewMode(newValue)}
                size="medium"
                sx={{
                  '& .MuiToggleButtonGroup-grouped': {
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:not(:first-of-type)': {
                      borderLeft: '1px solid',
                      borderColor: 'divider',
                      marginLeft: 0,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    },
                    '&:first-of-type': {
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    },
                  },
                }}
              >
                <ToggleButton
                  value="list"
                >
                  <ViewList sx={{ mr: 1 }} />
                  List
                </ToggleButton>
                <ToggleButton
                  value="board"
                >
                  <GridView sx={{ mr: 1 }} />
                  Board
                </ToggleButton>
              </ToggleButtonGroup>

              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                size="medium"
                sx={{
                  borderRadius: 1,
                  textTransform: 'none',
                  color: 'text.secondary',
                  borderColor: 'divider',
                  fontSize: '1rem',
                  py: 1.5,
                  px: 3,
                  '&:hover': {
                    borderColor: 'text.secondary',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                Refresh
              </Button>

              <Button
                variant="contained"
                onClick={handleCreate}
                size="medium"
                sx={{
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem',
                  py: 1.5,
                  px: 3,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                    bgcolor: 'primary.dark'
                  }
                }}
              >
                Create Post
              </Button>
            </Box>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : viewMode === 'board' ? (
          <BoardView posts={posts} onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <ListView posts={posts} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        <CreateEditPostDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleSave}
          initialData={activePostData}
          title={activePostData ? 'Edit Post' : 'Create New Post'}
        />
      </Container>
    </MainDashboardLayout>
  );
};

export default PostsPage;
