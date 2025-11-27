import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/DashboardLayout';
import { PhotoCamera } from '@mui/icons-material';

// --- Mock Data Fetching ---
// In a real app, this would be an API call.
const mockPosts = [
  {
    id: 1,
    title: 'First Community Post!',
    description: 'This is the very first post on our new platform. Welcome everyone!',
    author: 'Admin User', // Display name
    creatorId: 'user123', // Unique ID of the user who created this post
    image: 'https://source.unsplash.com/random/800x600?community',
  },
  {
    id: 2,
    title: 'Looking for project collaborators',
    description: 'I am starting a new open-source project and looking for frontend developers. React/Next.js experience is a plus!',
    author: 'Jane Doe', // Display name
    creatorId: 'user456', // Unique ID of the user who created this post
    image: 'https://source.unsplash.com/random/800x600?code',
  },
];

const getPostById = (id: number) => mockPosts.find((post) => post.id === id);
// --- End Mock Data ---

const EditPost: React.FC = () => {
  const router = useRouter();
  const { postId } = router.query;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const currentUserId = 'user123'; // Mock current user ID. Replace with actual user ID from auth.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId && typeof postId === 'string') {
      const numericPostId = parseInt(postId as string, 10);
      const post = getPostById(numericPostId);
      if (post) {
        setTitle(post.title);
        setDescription(post.description);
        // Authorization check: Redirect if the current user is not the creator
        if (post.creatorId !== currentUserId) {
          router.push('/dashboard'); // Or show an unauthorized message
          return;
        }
      }
      setLoading(false);
    }
  }, [postId, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Re-check authorization before submitting (important for security)
    const numericPostId = parseInt(postId as string, 10);
    const post = getPostById(numericPostId);
    if (!post || post.creatorId !== currentUserId) {
      console.error('Unauthorized attempt to edit post');
      return;
    }
    // TODO: Implement API call to update the post
    console.log('Updated Post Data:', { postId, title, description, image });
    router.push('/dashboard');
  };

  if (loading) {
    return <DashboardLayout><Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box></DashboardLayout>;
  }

  return (
    <DashboardLayout title="Edit Post">
      <Head>
        <title>Edit Post - Community Portal</title>
      </Head>
      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Edit Post
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Post Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="What's on your mind?"
            name="description"
            multiline
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
            Change Image
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>
          {image && <Typography sx={{ display: 'inline', ml: 2 }}>{image.name}</Typography>}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => router.push('/posts')} sx={{ mr: 2 }}>Cancel</Button>
            <Button type="submit" variant="contained" size="large">Save Changes</Button>
          </Box>
        </Box>
      </Paper>
    </DashboardLayout>
  );
};

export default EditPost;