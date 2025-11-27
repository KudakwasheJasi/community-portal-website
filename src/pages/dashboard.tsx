import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

// --- Mock Data ---
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

// In a real application, this would come from your authentication context or token
const mockEvents = [
  { id: 1, title: 'Community Meetup', date: '2025-12-15' },
  { id: 2, title: 'Tech Talk: State of JS', date: '2026-01-20' },
  { id: 3, title: 'Hackathon Weekend', date: '2026-02-05' },
];
// --- End Mock Data ---

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [posts, setPosts] = useState(mockPosts);
  const currentUserId = 'user123'; // Mock current user ID. Replace with actual user ID from auth.
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    router.push(`/posts/edit/${id}`);
  };

  const openDeleteConfirmation = (id: number) => {
    setSelectedPostId(id);
    setOpenDeleteDialog(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedPostId(null);
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    if (selectedPostId) {
      setPosts(posts.filter((post) => post.id !== selectedPostId));
      closeDeleteConfirmation();
    }
  };

  return (
    <Layout>
      <Head>
        <title>Dashboard - Community Portal</title>
      </Head>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Posts Section */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" component="h2" gutterBottom>
            Recent Posts
          </Typography>
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} key={post.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {post.image && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={post.image}
                      alt={post.title}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {post.description}
                    </Typography>
                    <Chip label={`By: ${post.author}`} size="small" />
                  </CardContent>
                  {post.creatorId === currentUserId && ( // Only show buttons if current user is the creator
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Button size="small" onClick={() => handleEdit(post.id)}>
                        Edit
                      </Button>
                      <Button size="small" color="error" onClick={() => openDeleteConfirmation(post.id)}>
                        Delete
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Events Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" component="h2" gutterBottom>
            Upcoming Events
          </Typography>
          <Paper elevation={2}>
            <List>
              {mockEvents.map((event, index) => (
                <React.Fragment key={event.id}>
                  <ListItem
                    secondaryAction={
                      <Button edge="end" variant="outlined" size="small">
                        Register
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={`Date: ${new Date(event.date).toLocaleDateString()}`}
                    />
                  </ListItem>
                  {index < mockEvents.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={closeDeleteConfirmation}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Dashboard;