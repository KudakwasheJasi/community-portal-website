import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Button } from '@mui/material';
import { People as PeopleIcon, GroupAdd as GroupAddIcon } from '@mui/icons-material';
import MainDashboardLayout from '@/components/MainDashboardLayout';

const Community: React.FC = () => {
  // Mock community data - in a real app, this would come from an API
  const communityMembers = [
    { id: 1, name: 'John Doe', role: 'Admin', avatar: '/images/avatar1.jpg' },
    { id: 2, name: 'Jane Smith', role: 'Moderator', avatar: '/images/avatar2.jpg' },
    { id: 3, name: 'Bob Johnson', role: 'Member', avatar: '/images/avatar3.jpg' },
    { id: 4, name: 'Alice Brown', role: 'Member', avatar: '/images/avatar4.jpg' },
  ];

  const communityStats = [
    { label: 'Total Members', value: '1,234', icon: <PeopleIcon /> },
    { label: 'Active Today', value: '89', icon: <GroupAddIcon /> },
  ];

  return (
    <MainDashboardLayout title="Community">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Community
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {communityStats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h5" component="div">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Community Members
        </Typography>

        <Grid container spacing={2}>
          {communityMembers.map((member) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={member.id}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{ width: 60, height: 60, mx: 'auto', mb: 2 }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" component="div">
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.role}
                  </Typography>
                  <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </MainDashboardLayout>
  );
};

export default Community;
