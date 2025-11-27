import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  const handleCreatePost = () => {
    router.push('/posts/create');
  };

  const handleLogout = () => {
    // TODO: Implement actual logout logic (clear token, update state)
    router.push('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => router.push('/dashboard')}>
            Community Portal
          </Typography>
          <Button color="inherit" startIcon={<AddIcon />} onClick={handleCreatePost}>
            New Post
          </Button>
          <IconButton color="inherit" onClick={handleLogout} aria-label="logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;