import React, { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title = 'Dashboard' }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - 280px)` },
          ml: { md: '280px' },
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 250px)` },
          marginLeft: { md: '90px' },
          marginTop: '64px',
          backgroundColor: theme.palette.grey[50],
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
