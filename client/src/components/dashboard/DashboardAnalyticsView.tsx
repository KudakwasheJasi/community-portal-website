'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Button,
  Fab,
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  useTheme,
  alpha,
  CardActionArea,
  Chip,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search,
  Group,
  TrendingUp,
  NorthEast,
  SouthEast,
  MoreHoriz,
  FavoriteBorder,
  ChatBubbleOutline,
  BookmarkBorder,
  LocationOn,
  Edit,
  BarChart,
  ThumbUp,
  AddCircleOutline,
  Add,
  Dashboard as DashboardIcon,
  Settings,
  Analytics,
} from '@mui/icons-material';
import postsService, { Post } from '@/services/posts.service';
import eventsService, { Event } from '@/services/events.service';

// --- Types & Interfaces ---
interface StatData {
  id: string;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: React.ElementType;
}

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

// --- Sub-Components ---
const StatCard: React.FC<{ data: StatData }> = ({ data }) => {
  const Icon = data.icon;
  const theme = useTheme();

  let trendColor = theme.palette.text.secondary;
  let TrendIcon = null;

  if (data.trend === 'up') {
    trendColor = theme.palette.success.main;
    TrendIcon = NorthEast;
  } else if (data.trend === 'down') {
    trendColor = theme.palette.error.main;
    TrendIcon = SouthEast;
  }

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.02)' },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
              }}
            >
              <Icon sx={{ fontSize: 18 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {data.label}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            <Typography variant="h5" fontWeight={700}>
              {data.value}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: trendColor }}>
              {TrendIcon && <TrendIcon sx={{ fontSize: 14 }} />}
              <Typography variant="caption" fontWeight={700}>
                {data.trendValue}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const PostCard: React.FC<{ data: Post }> = ({ data }) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
              {data.author?.username ? data.author.username.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {data.author?.username || 'Unknown Author'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(data.date).toLocaleDateString()}
              </Typography>
            </Box>
          </Stack>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreHoriz />
          </IconButton>
        </Stack>

        <Typography variant="body2" color="text.primary" sx={{ mb: 2, lineHeight: 1.6 }}>
          {data.description}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2}>
            <Button
              size="small"
              startIcon={<FavoriteBorder sx={{ fontSize: 18 }} />}
              sx={{ color: 'text.secondary', minWidth: 0, px: 1, '&:hover': { color: 'error.main' } }}
            >
              {data.views}
            </Button>
            <Button
              size="small"
              startIcon={<ChatBubbleOutline sx={{ fontSize: 18 }} />}
              sx={{ color: 'text.secondary', minWidth: 0, px: 1, '&:hover': { color: 'primary.main' } }}
            >
              0
            </Button>
          </Stack>
          <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            <BookmarkBorder sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

const EventCard: React.FC<{ data: Event }> = ({ data }) => {
  return (
    <Card
      sx={{
        minWidth: 280,
        maxWidth: 280,
        flexShrink: 0,
        position: 'relative',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 4 },
      }}
    >
      <Box
        sx={{
          height: 128,
          width: '100%',
          backgroundImage: `url(${data.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
          }}
        />
        <Box sx={{ position: 'absolute', bottom: 12, left: 12, right: 12, color: 'white' }}>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
            {data.title}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500 }}>
            {data.date} • {data.time}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
          <LocationOn sx={{ fontSize: 16 }} />
          <Typography variant="caption" fontWeight={600}>
            {data.location || 'TBD'}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={-0.75} alignItems="center">
          {[1, 2].map((i) => (
            <Avatar
              key={i}
              src={`https://picsum.photos/seed/attendee${i}${data.id}/100`}
              sx={{
                width: 24,
                height: 24,
                border: '2px solid white',
              }}
            />
          ))}
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: 'background.default',
              border: '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 700,
              color: 'text.secondary',
              zIndex: 1,
            }}
          >
            +12
          </Box>
        </Stack>
      </Box>
    </Card>
  );
};

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
        {/* Stats Grid */}
        <Grid container spacing={2}>
          {STATS.map((stat) => (
            <Grid item xs={6} key={stat.id}>
              <StatCard data={stat} />
            </Grid>
          ))}
        </Grid>

        {/* Recent Posts */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} px={0.5}>
            <Typography variant="h6">Recent Posts</Typography>
            <Button size="small" sx={{ fontWeight: 600 }}>See All</Button>
          </Stack>
          <Stack spacing={2}>
            {posts.map((post) => (
              <PostCard key={post.id} data={post} />
            ))}
          </Stack>
        </Box>

        {/* Upcoming Events */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} px={0.5}>
            <Typography variant="h6">Upcoming Events</Typography>
            <Button size="small" sx={{ fontWeight: 600 }}>See All</Button>
          </Stack>
          <Box
            className="no-scrollbar"
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              pb: 1,
              mx: -2,
              px: 2,
            }}
          >
            {events.map((event) => (
              <EventCard key={event.id} data={event} />
            ))}
          </Box>
        </Box>

        {/* Widgets */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} px={0.5}>
            <Typography variant="h6">Your Widgets</Typography>
            <Chip
              icon={<Edit sx={{ fontSize: '14px !important' }} />}
              label="Customize"
              size="small"
              color="primary"
              variant="filled"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                color: 'primary.main', 
                fontWeight: 600, 
                '& .MuiChip-icon': { color: 'inherit' } 
              }}
              onClick={() => {}}
            />
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card sx={{ height: '100%', aspectRatio: '1' }}>
                <CardActionArea sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  p: 2 
                }}>
                  <BarChart sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600} align="center">User Growth</Typography>
                  <Typography variant="caption" color="text.secondary" align="center">Weekly report</Typography>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ height: '100%', aspectRatio: '1' }}>
                <CardActionArea sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  p: 2 
                }}>
                  <ThumbUp sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600} align="center">Top Posts</Typography>
                  <Typography variant="caption" color="text.secondary" align="center">Most liked</Typography>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Paper
                variant="outlined"
                sx={{
                  height: '100%',
                  aspectRatio: '1',
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': { 
                    borderColor: 'primary.main', 
                    color: 'primary.main', 
                    bgcolor: alpha(theme.palette.primary.main, 0.04) 
                  },
                }}
              >
                <AddCircleOutline sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="subtitle2" fontWeight={600}>Add Widget</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Stack>

    </Box>
  );
};

export default AdvancedDashboard;
