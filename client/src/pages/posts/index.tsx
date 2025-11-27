import React, { useState, useRef, ChangeEvent } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { uploadFile, validateImage } from '@/utils/fileUpload';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/components/hooks/useAuth';

interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  image?: string;
  author: string;
  creatorId: string; // Add creatorId to the interface
  date: string;
  status: 'Draft' | 'Published' | 'Archived';
  category: string;
  views: number;
  likes: number;
  comments: number;
}

// Mock data for posts
const initialPosts: Post[] = [
  {
    id: 1,
    title: 'Welcome to our Community!',
    description: 'A warm welcome to all new members',
    content: 'Welcome everyone to our new community portal. Feel free to share your thoughts and connect with other members!',
    image: 'https://source.unsplash.com/random/800x400?community',
    author: 'Admin',
    creatorId: 'user123',
    date: '2025-11-27',
    status: 'Published',
    category: 'Announcement',
    views: 150,
    likes: 42,
    comments: 12
  },
  {
    id: 2,
    title: 'Upcoming Maintenance',
    description: 'Scheduled system maintenance',
    content: 'Scheduled maintenance will occur this weekend. The portal will be temporarily unavailable for 2 hours.',
    image: 'https://source.unsplash.com/random/800x400?maintenance',
    author: 'Support Team',
    creatorId: 'user456',
    date: '2025-11-26',
    status: 'Draft',
    category: 'Update',
    views: 80,
    likes: 15,
    comments: 5
  }
];

const categories = ['Announcement', 'Update', 'Event', 'News', 'Tutorial'];
const statuses = ['Draft', 'Published', 'Archived'];

const PostManagement: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<Post> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddPost = () => {
    setCurrentPost({
      id: 0,
      title: '',
      description: '',
      content: '',
      status: 'Draft',
      category: 'Announcement',
      author: user?.name || 'User',
      date: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      comments: 0
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleEditPost = (post: Post) => {
    setCurrentPost({ ...post });
    setErrors({});
    setOpenDialog(true);
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentPost) return;

    const validation = validateImage(file);
    if (!validation.valid) {
      setErrors({ ...errors, image: validation.message });
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadFile(file);
      setCurrentPost({ ...currentPost, image: imageUrl });
      setErrors({ ...errors, image: undefined });
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors({ ...errors, image: 'Failed to upload image' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    if (currentPost) {
      setCurrentPost({ ...currentPost, image: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!currentPost?.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!currentPost?.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!currentPost?.content?.trim()) {
      newErrors.content = 'Content is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeletePost = (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  const handleSavePost = () => {
    if (!currentPost) return;
    
    if (!validateForm()) return;

    if (currentPost.id === 0) {
      // Add new post
      const newPost: Post = {
        ...currentPost as Omit<Post, 'id'>,
        id: Math.max(...posts.map(p => p.id), 0) + 1,
        creatorId: user?.id || '', // Set the creatorId from the logged-in user
        author: user?.name || 'User',
        views: 0,
        likes: 0,
        comments: 0,
        category: currentPost.category || 'Announcement',
        status: currentPost.status || 'Draft'
      };
      setPosts([...posts, newPost]);
    } else {
      // Update existing post
      setPosts(posts.map(post => 
        post.id === currentPost.id ? { ...post, ...currentPost } as Post : post
      ));
    }
    setOpenDialog(false);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Post Management">
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Post Management
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAddPost}
          >
            Add New Post
          </Button>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Views</TableCell>
                  <TableCell>Likes</TableCell>
                  <TableCell>Comments</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {post.image && (
                          <Avatar 
                            src={post.image} 
                            variant="rounded" 
                            sx={{ width: 40, height: 40 }}
                          />
                        )}
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {post.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {post.category}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>{post.date}</TableCell>
                    <TableCell>
                      <Chip 
                        label={post.status}
                        size="small"
                        color={
                          post.status === 'Published' ? 'success' : 
                          post.status === 'Draft' ? 'default' : 'secondary'
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{post.views}</TableCell>
                    <TableCell>{post.likes}</TableCell>
                    <TableCell>{post.comments}</TableCell>
                    <TableCell>
                      {user?.id === post.creatorId && ( // Check if the current user is the creator
                        <>
                          <IconButton onClick={() => handleEditPost(post)} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeletePost(post.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {/* Add/Edit Post Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: 800
          }
        }}
      >
        <DialogTitle>{currentPost?.id === 0 ? 'Add New Post' : 'Edit Post'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid size ={6} md={8}>
              <TextField
                fullWidth
                label="Title"
                value={currentPost?.title || ''}
                onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                margin="normal"
                error={!!errors.title}
                helperText={errors.title}
                required
              />
              <TextField
                fullWidth
                label="Short Description"
                value={currentPost?.description || ''}
                onChange={(e) => setCurrentPost({...currentPost, description: e.target.value})}
                margin="normal"
                error={!!errors.description}
                helperText={errors.description}
                required
              />
              <TextField
                fullWidth
                label="Content"
                multiline
                rows={8}
                value={currentPost?.content || ''}
                onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})}
                margin="normal"
                error={!!errors.content}
                helperText={errors.content}
                required
              />
            </Grid>
            <Grid size={6} md={4}>
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>Featured Image</Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                  {currentPost?.image ? (
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={currentPost.image}
                        alt="Post"
                        style={{
                          width: '100%',
                          borderRadius: 4,
                          marginBottom: 8,
                          aspectRatio: '16/9',
                          objectFit: 'cover'
                        }}
                      />
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Button
                          size="small"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          startIcon={<EditIcon />}
                        >
                          Change
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={handleRemoveImage}
                          disabled={isUploading}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box 
                      sx={{
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 1,
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'action.hover'
                        },
                        mb: 2
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isUploading ? (
                        <CircularProgress size={24} />
                      ) : (
                        <>
                          <CloudUploadIcon fontSize="large" color="action" />
                          <Typography variant="caption" display="block">
                            Click to upload or drag and drop
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            PNG, JPG, GIF up to 5MB
                          </Typography>
                        </>
                      )}
                    </Box>
                  )}
                  {errors.image && (
                    <Typography color="error" variant="caption">
                      {errors.image}
                    </Typography>
                  )}
                </CardContent>
              </Card>

              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={currentPost?.status || 'Draft'}
                  onChange={(e) => setCurrentPost({...currentPost, status: e.target.value as any})}
                  label="Status"
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={currentPost?.category || 'Announcement'}
                  onChange={(e) => setCurrentPost({...currentPost, category: e.target.value as string})}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSavePost} 
            variant="contained" 
            color="primary"
            startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : null}
            disabled={isUploading}
          >
            {currentPost?.id === 0 ? 'Publish' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default PostManagement;
