// src/pages/dashboard/index.tsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  LinearProgress, 
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Button
} from '@mui/material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Update as UpdateIcon,
  Event as EventIcon,
  MoreVert as MoreVertIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowUpward as ArrowUpwardIcon
} from '@mui/icons-material';
import DashboardLayout from '@/components/DashboardLayout';
import { styled } from '@mui/material/styles';

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '12px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px 0 rgba(0,0,0,0.1)'
  }
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  marginTop: '16px',
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
  },
}));

interface EventItemProps {
  title: string;
  date: string;
  time: string;
  color?: string;
}

const EventItem = ({ title, date, time, color = '#4F46E5' }: EventItemProps) => (
  <>
    <ListItem 
      alignItems="flex-start"
      sx={{ 
        px: 0,
        '&:hover': {
          backgroundColor: 'rgba(0,0,0,0.02)',
          cursor: 'pointer',
          borderRadius: '8px',
        },
        transition: 'all 0.2s',
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: `${color}20`, color: color }}>
          <EventIcon fontSize="small" />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle2" fontWeight={500}>
            {title}
          </Typography>
        }
        secondary={
          <Typography variant="caption" color="text.secondary">
            {date} • {time}
          </Typography>
        }
      />
      <IconButton size="small" edge="end" aria-label="more">
        <MoreVertIcon fontSize="small" />
      </IconButton>
    </ListItem>
    <Divider variant="inset" component="li" sx={{ ml: 7 }} />
  </>
);

const Dashboard = () => {
  const stats = [
    { title: 'TOTAL TASK', value: '234', icon: <AssignmentIcon />, color: '#4F46E5' },
    {
      title: 'Total Projects',
      value: '156',
      value2: '12% from last month',
      color: '#4CAF50',
      icon: <AssignmentIcon />,
      progress: 75
    },
    {
      title: 'In Progress',
      value: '42',
      value2: '5% from last month',
      color: '#2196F3',
      icon: <UpdateIcon />,
      progress: 65
    },
    {
      title: 'Completed',
      value: '98',
      value2: '8% from last month',
      color: '#9C27B0',
      icon: <CheckCircleIcon />,
      progress: 85
    },
    {
      title: 'Total Members',
      value: '1,234',
      value2: '15% from last month',
      color: '#FF9800',
      icon: <EventIcon />,
      progress: 70
    }
  ];

  const upcomingEvents = [
    { title: 'Community Meetup', date: 'Dec 15, 2025', time: '2:00 PM - 4:00 PM' },
    { title: 'Project Deadline', date: 'Dec 18, 2025', time: '11:59 PM' },
    { title: 'Team Sync', date: 'Dec 20, 2025', time: '10:00 AM - 11:00 AM' },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Dashboard Overview
        </Typography>
        
        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} lg key={index}>
              <StatCard>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Avatar sx={{ bgcolor: `${stat.color}20`, color: stat.color, width: 40, height: 40 }}>
                      {stat.icon || <AssignmentIcon />}
                    </Avatar>
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={600} mb={0.5}>
                      {stat.value}
                    </Typography>
                    {stat.value2 && (
                      <Typography variant="caption" color="text.secondary">
                        {stat.value2}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </StatCard>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Completion Rate */}
          <Grid item xs={12} md={8}>
            <StatCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    Completion Rate
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    View All <ArrowForwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                  </Typography>
                </Box>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="h4" fontWeight={700} color="primary">
                      76%
                    </Typography>
                    <Box sx={{ 
                      bgcolor: 'rgba(99, 102, 241, 0.1)',
                      color: '#4F46E5',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      +2.5%
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    +12% from last month
                  </Typography>
                  <ProgressBar variant="determinate" value={76} />
                </Box>
              </CardContent>
            </StatCard>
          </Grid>

          {/* Upcoming Events */}
          <Grid item xs={12} md={4}>
            <StatCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    Upcoming Events
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    View All <ArrowForwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                  </Typography>
                </Box>
                <List sx={{ p: 0 }}>
                  {upcomingEvents.map((event, index) => (
                    <EventItem 
                      key={index}
                      title={event.title}
                      date={event.date}
                      time={event.time}
                      color={['#4F46E5', '#8B5CF6', '#10B981'][index % 3]}
                    />
                  ))}
                </List>
              </CardContent>
            </StatCard>
          </Grid>
        </Grid>

        {/* Posts Section */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>Recent Posts</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>Latest</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>Popular</Typography>
            </Box>
          </Box>

          {/* Post Card */}
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              {/* Post Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 48, height: 48, mr: 2 }} src="/placeholder-avatar.jpg" />
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>Alex Johnson</Typography>
                  <Typography variant="caption" color="text.secondary">2 hours ago</Typography>
                </Box>
                <IconButton sx={{ ml: 'auto' }}>
                  <MoreVertIcon />
                </IconButton>
              </Box>

              {/* Post Content */}
              <Typography variant="body1" paragraph>
                Just finished the new community project! 🎉 Can't wait to see what you all think about it. 
                We've worked really hard to make this happen.
              </Typography>
              
              {/* Post Image */}
              <Box 
                component="img"
                src="/placeholder-post.jpg"
                alt="Post content"
                sx={{ 
                  width: '100%', 
                  borderRadius: 1.5,
                  mb: 2,
                  maxHeight: 400,
                  objectFit: 'cover'
                }}
              />

              {/* Post Stats */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                  <FavoriteBorderIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">245</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ChatBubbleOutlineIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">24 Comments</Typography>
                </Box>
              </Box>

              {/* Post Actions */}
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button startIcon={<ThumbUpAltOutlinedIcon />} sx={{ color: 'text.secondary' }}>
                  Like
                </Button>
                <Button startIcon={<ChatBubbleOutlineOutlinedIcon />} sx={{ color: 'text.secondary' }}>
                  Comment
                </Button>
                <Button startIcon={<ShareOutlinedIcon />} sx={{ color: 'text.secondary' }}>
                  Share
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Second Post */}
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 48, height: 48, mr: 2 }}>JD</Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>Jane Doe</Typography>
                  <Typography variant="caption" color="text.secondary">5 hours ago</Typography>
                </Box>
                <IconButton sx={{ ml: 'auto' }}>
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Typography variant="body1" paragraph>
                Just shared some thoughts about our next community event. Let me know what you think! #CommunityBuilding
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                  <FavoriteBorderIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">132</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ChatBubbleOutlineIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">18 Comments</Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button startIcon={<ThumbUpAltOutlinedIcon />} sx={{ color: 'text.secondary' }}>
                  Like
                </Button>
                <Button startIcon={<ChatBubbleOutlineOutlinedIcon />} sx={{ color: 'text.secondary' }}>
                  Comment
                </Button>
                <Button startIcon={<ShareOutlinedIcon />} sx={{ color: 'text.secondary' }}>
                  Share
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;