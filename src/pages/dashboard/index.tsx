// src/pages/dashboard/index.tsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  LinearProgress,
  IconButton,
  Button
} from '@mui/material';
import { 
  GridView as GridIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  ArrowUpward as ArrowUpIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';

// Mock data for posts
const posts = [
  {
    id: 1,
    title: 'Welcome to our Community!',
    author: 'Admin',
    date: '2025-11-27',
    content: 'Welcome everyone to our new community portal. Feel free to share your thoughts and connect with other members!',
    likes: 42,
    comments: 12
  },
  {
    id: 2,
    title: 'Upcoming Maintenance',
    author: 'Support Team',
    date: '2025-11-26',
    content: 'Scheduled maintenance will occur this weekend. The portal will be temporarily unavailable for 2 hours.',
    likes: 15,
    comments: 5
  }
];

// Mock data for upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: 'Community Meetup',
    date: '2025-12-15',
    time: '18:00',
    location: 'Virtual Meeting',
    description: 'Join us for our monthly community meetup!'
  },
  {
    id: 2,
    title: 'Workshop: Getting Started',
    date: '2025-12-20',
    time: '14:00',
    location: 'Main Hall',
    description: 'Learn the basics of our community platform.'
  }
];

const data = [
  { name: 'High', total: 2300 },
  { name: 'Medium', total: 2100 },
  { name: 'Normal', total: 3200 },
  { name: 'Low', total: 2200 },
];

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  const stats = [
    { 
      title: 'TOTAL POSTS', 
      value: posts.length.toString(), 
      change: `${posts.length} this week`, 
      icon: <GridIcon />,
      color: 'primary'
    },
    { 
      title: 'UPCOMING EVENTS', 
      value: upcomingEvents.length.toString(), 
      change: `${upcomingEvents.length} this month`, 
      icon: <CheckCircleIcon />,
      color: 'success'
    },
    { 
      title: 'COMMUNITY MEMBERS', 
      value: '1.2k', 
      change: '45 new this month', 
      icon: <StarIcon />,
      color: 'secondary'
    }
  ];

  return (
    <DashboardLayout title="Dashboard">
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.name || 'User'}
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: 1
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: `${stat.color}.light`,
                      color: `${stat.color}.dark`,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <Typography variant="h6" component="div" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={12}>
        {/* Recent Posts */}
        <Grid size={6} md={8}>
          <Card sx={{ borderRadius: 2, boxShadow: 1, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Posts</Typography>
              {posts.map((post) => (
                <Box key={post.id} sx={{ mb: 3, pb: 2, borderBottom: '1px solid #eee' }}>
                  <Typography variant="subtitle1" fontWeight="bold">{post.title}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    By {post.author} • {new Date(post.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" paragraph>{post.content}</Typography>
                  <Box display="flex" gap={2}>
                    <Typography variant="body2" color="text.secondary">
                      {post.likes} likes • {post.comments} comments
                    </Typography>
                  </Box>
                </Box>
              ))}
              <Button variant="text" color="primary">View All Posts</Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid size ={6} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 1, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
              {upcomingEvents.map((event) => (
                <Box key={event.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                  <Typography variant="subtitle2" fontWeight="bold">{event.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(event.date).toLocaleDateString()} • {event.time}
                  </Typography>
                  <Typography variant="body2">{event.location}</Typography>
                  <Typography variant="body2" color="text.secondary">{event.description}</Typography>
                </Box>
              ))}
              <Button variant="text" color="primary">View All Events</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default Dashboard;