'use client';

import React, { useState } from 'react';
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

// --- Types & Interfaces ---
interface StatData {
  id: string;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: React.ElementType;
}

interface PostData {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
}

interface EventData {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  image: string;
}

// --- Mock Data ---
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

const POSTS: PostData[] = [
  {
    id: '1',
    author: 'Olivia Chen',
    avatar: 'https://picsum.photos/seed/olivia/200',
    time: '2h ago',
    content:
      'Just released a new plugin for our design system. It includes new components, improved accessibility, and better performance. Would love to get everyone\'s feedback!',
    likes: 24,
    comments: 8,
  },
  {
    id: '2',
    author: 'Liam Gallagher',
    avatar: 'https://picsum.photos/seed/liam/200',
    time: '5h ago',
    content:
      'Does anyone have experience with the new beta features? Looking for tips on how to get started.',
    likes: 15,
    comments: 4,
  },
];

const EVENTS: EventData[] = [
  {
    id: '1',
    title: 'Design System Meetup',
    date: 'Mon, Oct 28 • 7:00 PM',
    location: 'Virtual Event',
    attendees: 12,
    image: 'https://picsum.photos/seed/event1/600/400',
  },
  {
    id: '2',
    title: 'Project Showcase',
    date: 'Wed, Nov 6 • 5:30 PM',
    location: 'Community Hall',
    attendees: 8,
    image: 'https://picsum.photos/seed/event2/600/400',
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

const PostCard: React.FC<{ data: PostData }> = ({ data }) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar src={data.avatar} alt={data.author} sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {data.author}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {data.time}
              </Typography>
            </Box>
          </Stack>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreHoriz />
          </IconButton>
        </Stack>

        <Typography variant="body2" color="text.primary" sx={{ mb: 2, lineHeight: 1.6 }}>
          {data.content}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2}>
            <Button
              size="small"
              startIcon={<FavoriteBorder sx={{ fontSize: 18 }} />}
              sx={{ color: 'text.secondary', minWidth: 0, px: 1, '&:hover': { color: 'error.main' } }}
            >
              {data.likes}
            </Button>
            <Button
              size="small"
              startIcon={<ChatBubbleOutline sx={{ fontSize: 18 }} />}
              sx={{ color: 'text.secondary', minWidth: 0, px: 1, '&:hover': { color: 'primary.main' } }}
            >
              {data.comments}
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

const EventCard: React.FC<{ data: EventData }> = ({ data }) => {
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
          backgroundImage: `url(${data.image})`,
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
            {data.date}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
          <LocationOn sx={{ fontSize: 16 }} />
          <Typography variant="caption" fontWeight={600}>
            {data.location}
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
            +{data.attendees}
          </Box>
        </Stack>
      </Box>
    </Card>
  );
};

// --- Main Component ---
const AdvancedDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

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
            {POSTS.map((post) => (
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
            {EVENTS.map((event) => (
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
