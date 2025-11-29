'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Stack,
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  Paper,
  Alert,
  CircularProgress,
  Button,
  Chip,
  Card,
  CardActionArea,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Group,
  TrendingUp,
  ChatBubbleOutline,
  LocationOn,
  Dashboard as DashboardIcon,
  Analytics,
  Edit,
  BarChart,
  ThumbUp,
  AddCircleOutline,
} from '@mui/icons-material';
import postsService, { Post } from '@/services/posts.service';
import eventsService, { Event } from '@/services/events.service';
import StatsSection from './StatsSection';
import RecentPostsSection from './RecentPostsSection';
import UpcomingEventsSection from './UpcomingEventsSection';
import WidgetsSection from './WidgetsSection';
import { StatData } from './types';

// --- Mock Data (for stats only, posts and events will be fetched) ---
const STATS: StatData[] = [
  {
    id: '1',
    label: 'Active Users',
    value: '1.2K',
    trend: 'up',
    trendValue: '+5.2%',
    icon: Group,
  },
  {
    id: '2',
    label: 'Engagement',
    value: '63%',
    trend: 'down',
    trendValue: '-1.8%',
    icon: TrendingUp,
  },
  {
    id: '3',
    label: 'New Posts',
    value: '48',
    trend: 'neutral',
    trendValue: 'Today',
    icon: ChatBubbleOutline,
  },
  {
    id: '4',
    label: 'Events Today',
    value: '3',
    trend: 'neutral',
    trendValue: 'Upcoming',
    icon: LocationOn,
  },
];

// --- Main Component ---
const AdvancedDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const [fetchedPosts, fetchedEvents] = await Promise.all([
          postsService.getAll({ limit: 2 }),
          eventsService.getAll()
        ]);
        setPosts(fetchedPosts);
        setEvents(fetchedEvents.slice(0, 2)); // Show only first 2 events
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: 'background.default',
        position: 'relative',
        pb: 2,
      }}
    >

      {/* Main Content */}
      <Stack spacing={4} sx={{ p: 2, overflowX: 'hidden' }}>
        <StatsSection stats={STATS} />
        <RecentPostsSection posts={posts} />
        <UpcomingEventsSection events={events} />
        <WidgetsSection />
      </Stack>

    </Box>
  );
};

export default AdvancedDashboard;
