import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PostAdd as PostAddIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

const drawerWidth = 280;
const collapsedWidth = 72;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Post Management', icon: <PostAddIcon />, path: '/posts' },
    { text: 'Event Registration', icon: <EventIcon />, path: '/events' },
    { text: 'Community', icon: <PeopleIcon />, path: '/community' },
  ];

  const bottomMenuItems = [
    { text: 'Settings', icon: <SettingsIcon />, action: () => router.push('/settings') },
    { text: 'Logout', icon: <LogoutIcon />, action: logout },
  ];

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{
        p: collapsed ? 2 : 3,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between'
      }}>
        {!collapsed && (
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.main,
              fontSize: '1.5rem',
              letterSpacing: '0.5px'
            }}
          >
            Community Portal
          </Typography>
        )}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      
      <Divider />
      
      <List sx={{ flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Tooltip title={collapsed ? item.text : ''} placement="right">
              <ListItemButton
                selected={router.pathname === item.path}
                onClick={() => {
                  router.push(item.path);
                  if (isMobile) handleDrawerToggle();
                }}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.contrastText,
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                  borderRadius: '0 24px 24px 0',
                  my: 0.5,
                  mx: 1,
                  px: collapsed ? 2 : 3,
                  justifyContent: collapsed ? 'center' : 'initial',
                }}
              >
                <ListItemIcon sx={{
                  minWidth: collapsed ? 'auto' : 40,
                  mr: collapsed ? 0 : 2
                }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List>
        {bottomMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Tooltip title={collapsed ? item.text : ''} placement="right">
              <ListItemButton
                onClick={item.action}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                  borderRadius: '0 24px 24px 0',
                  my: 0.5,
                  mx: 1,
                  px: collapsed ? 2 : 3,
                  justifyContent: collapsed ? 'center' : 'initial',
                }}
              >
                <ListItemIcon sx={{
                  minWidth: collapsed ? 'auto' : 40,
                  mr: collapsed ? 0 : 2
                }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: collapsed ? collapsedWidth : drawerWidth },
        flexShrink: { md: 0 },
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
      aria-label="mailbox folders"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: collapsed ? collapsedWidth : drawerWidth,
            borderRight: 'none',
            boxShadow: theme.shadows[3],
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
