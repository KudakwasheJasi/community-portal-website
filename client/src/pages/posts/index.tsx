import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Stack,
  useMediaQuery,
  Paper,
  CircularProgress,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PostAdd as PostAddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ViewList as ViewListIcon,
  GridView as GridViewIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import MainDashboardLayout from '@/components/MainDashboardLayout';
import CreateEditPostDialog from '@/components/posts/CreateEditPostDialog';
import { Post, PostFormData } from '@/types/post';
import { useTheme } from '@mui/material/styles';

// Mock data for initial posts
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'Community Meetup Announcement',
    description: "Join us next Saturday for our quarterly community meetup. We'll have snacks, games, and great conversations to help everyone connect.",
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc_w-Kfy3kwesRAQOXvXWbuFxmcLAe3Kp4Z7HGynJK4lN9Pt3mR-15oyli934qLPclMXJM4AJBVY4EyEN_VpkWoLNEnh2ctkcbBxe8PeXNbJNwCm7pJBnjr9wKNBjdJzlXY-a0ejMTw4azq0g0fzbdCWsbVb0B8aAyarKb8u_5E4ibHTEilyogSd3QGbS105w527LS6HqehLZmWvlW-N0XqF1qbz9BxQ-qRBn6I_Tql1PMhN8IbhAYWHsjKbTcZ0NbhKhJ-1PG2mZ1',
    date: new Date('2023-06-15').toISOString(),
    status: 'published',
    views: 245,
    author: 'John Doe',
    tags: ['event', 'community']
  },
  {
    id: '2',
    title: 'New Features Rolled Out!',
    description: "We've just launched a new set of features to make managing your profile easier. Check them out now in your settings panel.",
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR_3J51CbfQUDXhMnW9uWP3236cX_4Jj1m5UD8fgqGa47mO04-CLQN34MX2p2w-4S8i7HDOSA1_G5rtWZjhTKG-AhhzO4BPn2E8f3sjSrPk7YpdKWrLekmqD_FILyZdlYUwOPiCu-4iZ4fLiZqTWXdolQSXkTmKn--5KcSuqlkELc849_gzPcNgq-Aoh4xuIP54KeQoY9dhjOL_z20tOSN6SBtMqdaHzIOYn-msmkQQp6AGU0reit4DhSPB73MH08HcJDhCMl2IGLh',
    date: new Date('2023-06-10').toISOString(),
    status: 'draft',
    views: 132,
    author: 'Jane Smith',
    tags: ['update', 'features']
  },
  {
    id: '3',
    title: 'Summer Internship Program',
    description: 'Applications for our summer internship program are now open. Join our team and gain valuable experience in your field of interest.',
    imageUrl: 'https://source.unsplash.com/random/400x300?internship',
    date: new Date('2023-06-05').toISOString(),
    status: 'published',
    views: 189,
    author: 'Alex Johnson',
    tags: ['career', 'opportunity']
  },
  {
    id: '4',
    title: 'System Maintenance Notice',
    description: 'Scheduled maintenance will be performed on our servers this weekend. There may be some downtime during this period.',
    imageUrl: 'https://source.unsplash.com/random/400x300?maintenance',
    date: new Date('2023-06-01').toISOString(),
    status: 'archived',
    views: 98,
    author: 'IT Department',
    tags: ['announcement', 'maintenance']
  }
];

const DEFAULT_IMAGE = 'https://picsum.photos/800/600';

type ViewMode = 'grid' | 'list';

const PostsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load view mode preference from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('postsViewMode') as ViewMode;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view mode preference to localStorage
  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode | null,
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
      localStorage.setItem('postsViewMode', newViewMode);
    }
  };

  // Filter posts based on search query
  useEffect(() => {
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const activePostData = useMemo(() => {
    if (!editingPostId) return undefined;
    return posts.find(post => post.id === editingPostId);
  }, [editingPostId, posts]);

  const handleCreate = () => {
    setEditingPostId(null);
    setDialogOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPostId(post.id);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(prev => prev.filter(post => post.id !== id));
    }
  };

  const handleSave = (data: PostFormData) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (data.id) {
        // Update existing post
        setPosts(prev =>
          prev.map(post =>
            post.id === data.id
              ? { 
                  ...post, 
                  ...data, 
                  imageUrl: data.imageUrl || DEFAULT_IMAGE,
                  date: new Date().toISOString()
                }
              : post
          )
        );
      } else {
        // Create new post
        const newPost: Post = {
          id: Math.random().toString(36).substr(2, 9),
          ...data,
          imageUrl: data.imageUrl || DEFAULT_IMAGE,
          date: new Date().toISOString(),
          status: 'published',
          views: 0,
          author: 'Current User',
          tags: []
        };
        setPosts(prev => [newPost, ...prev]);
      }
      setLoading(false);
      setDialogOpen(false);
    }, 500);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
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
    <MainDashboardLayout title="Posts Management">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box>
          {/* Header Section */}
          <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Box>
              <Typography variant="h5" component="h1" sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 0.5
              }}>
                Post Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage and organize your community posts
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                size="small"
                sx={{ 
                  borderRadius: 1,
                  textTransform: 'none',
                  color: 'text.secondary',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'text.secondary',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                Refresh
              </Button>
              
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                aria-label="view mode"
                size="small"
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
                <ToggleButton value="grid" aria-label="grid view">
                  <GridViewIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="list" aria-label="list view">
                  <ViewListIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
                size="small"
                sx={{ 
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2,
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
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <TextField
              size="small"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: 1,
                  backgroundColor: 'background.paper',
                  width: 280,
                  '& input': {
                    py: 0.8,
                  },
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                },
              }}
            />
            
            <Typography variant="body2" color="text.secondary">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : viewMode === 'grid' ? (
          <Grid container spacing={1.5} component="div">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Grid item xs={12} sm={6} md={6} lg={6} key={post.id}>
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                    position: 'relative',
                    overflow: 'visible',
                    maxWidth: 480,
                    margin: '0 auto',
                  }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={post.imageUrl || DEFAULT_IMAGE}
                      alt={post.title}
                      sx={{
                        objectFit: 'cover',
                        borderTopLeftRadius: '6px',
                        borderTopRightRadius: '6px',
                        aspectRatio: '16/9',
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Chip
                          label={post.status}
                          size="medium"
                          color={getStatusColor(post.status) as any}
                          sx={{ 
                            height: 26, 
                            fontSize: '0.9rem',
                            '& .MuiChip-label': { px: 1.5 }
                          }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                          {new Date(post.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="h6" component="h3" sx={{ 
                        mb: 1.5, 
                        fontWeight: 600,
                        fontSize: '1.25rem',
                        lineHeight: 1.4
                      }}>
                        {post.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '1rem',
                        lineHeight: 1.5,
                        height: '3em',
                        mb: 1.5
                      }}>
                        {post.description}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 0.5, pt: 0, justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 20, 
                            height: 20, 
                            fontSize: '0.6rem',
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText'
                          }}
                        >
                          {post.author ? post.author.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                      </Box>
                      <Box>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(post); }} sx={{ p: 0.25, color: 'text.secondary' }}>
                            <EditIcon fontSize="small" sx={{ fontSize: '0.9rem' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }} sx={{ p: 0.25, color: 'error.main' }}>
                            <DeleteIcon fontSize="small" sx={{ fontSize: '0.9rem' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 2,
                    borderStyle: 'dashed',
                    backgroundColor: 'background.paper',
                    width: '100%'
                  }}
                >
                  <PostAddIcon 
                    sx={{ 
                      fontSize: 48, 
                      color: 'text.disabled', 
                      opacity: 0.5,
                      mb: 2
                    }} 
                  />
                  <Typography variant="h6" gutterBottom>
                    No posts found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}>
                    {searchQuery ? 'No posts match your search criteria.' : 'Get started by creating your first post.'}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                    size="small"
                    sx={{ 
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 500,
                      px: 3,
                      py: 0.8,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                        bgcolor: 'primary.dark'
                      }
                    }}
                  >
                    Create Post
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        ) : (
          // List View
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
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
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
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box 
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                overflow: 'hidden',
                                mr: 2,
                                flexShrink: 0
                              }}
                            >
                              <img 
                                src={post.imageUrl} 
                                alt={post.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 500, lineHeight: 1.3 }}>
                                {post.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ 
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {post.description}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Chip 
                            label={post.status.charAt(0).toUpperCase() + post.status.slice(1)} 
                            size="small" 
                            color={getStatusColor(post.status) as any}
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
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              src="" 
                              alt={post.author}
                              sx={{ width: 24, height: 24, mr: 1, fontSize: '0.7rem' }}
                            >
                              {post.author.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <Typography variant="body2">
                              {post.author}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(post.date).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.5, textAlign: 'right' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Tooltip title="View">
                              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton 
                                size="small" 
                                onClick={() => handleEdit(post)}
                                sx={{ color: 'text.secondary' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDelete(post.id)}
                                sx={{ color: 'error.main' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ py: 4, textAlign: 'center' }}>
                        <PostAddIcon 
                          sx={{ 
                            fontSize: 48, 
                            color: 'text.disabled', 
                            opacity: 0.5,
                            mb: 2
                          }} 
                        />
                        <Typography variant="h6" gutterBottom>
                          No posts found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                          {searchQuery ? 'No posts match your search criteria.' : 'Get started by creating your first post.'}
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleCreate}
                          size="small"
                          sx={{ 
                            borderRadius: 1,
                            textTransform: 'none',
                            fontWeight: 500,
                            px: 3,
                            py: 0.8,
                            boxShadow: 'none',
                            '&:hover': {
                              boxShadow: 'none',
                              bgcolor: 'primary.dark'
                            }
                          }}
                        >
                          Create Post
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        <CreateEditPostDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleSave}
          initialData={activePostData}
          title={activePostData ? 'Edit Post' : 'Create New Post'}
        />
      </Box>
    </Container>
  </MainDashboardLayout>
  );
};

export default PostsPage;
