import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Input,
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { PhotoCamera } from '@mui/icons-material';

const CreatePost: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save the post
    console.log({ title, description, image });
    // Redirect to dashboard after submission
    router.push('/dashboard');
  };

  return (
    <Layout>
      <Head>
        <title>Create New Post - Community Portal</title>
      </Head>
      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Create a New Post
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Post Title"
            name="title"
            autoFocus
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
            Upload Image
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>
          {image && <Typography sx={{ display: 'inline', ml: 2 }}>{image.name}</Typography>}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => router.back()} sx={{ mr: 2 }}>Cancel</Button>
            <Button type="submit" variant="contained" size="large">Post</Button>
          </Box>
        </Box>
      </Paper>
    </Layout>
  );
};

export default CreatePost;