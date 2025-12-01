// client/src/components/events/EventList.tsx
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Event } from '@/services/events.service';
import { useRouter } from 'next/router';
import { useEvents } from '@/context/EventContext';

interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  const router = useRouter();
  const { registerForEvent, unregisterFromEvent, loadingStates } = useEvents();

  if (events.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="textSecondary">
          No events found
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => router.push('/events/new')}
        >
          Create Your First Event
        </Button>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {events.map((event) => (
        <Grid item xs={12} sm={6} md={4} key={event.id}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 3,
              transition: 'all 0.3s ease-in-out',
            }
          }}>
            {event.imageUrl && (
              <CardMedia
                component="img"
                height="160"
                image={event.imageUrl}
                alt={event.title}
                sx={{ objectFit: 'cover' }}
              />
            )}
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography gutterBottom variant="h6" component="h3" noWrap>
                {event.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                mb: 2
              }}>
                {event.description}
              </Typography>
              
              <Box mt="auto">
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                  <Chip 
                    label={new Date(event.startDate).toLocaleDateString()} 
                    size="small" 
                    variant="outlined" 
                  />
                  {event.location && (
                    <Chip 
                      label={event.location} 
                      size="small" 
                      variant="outlined" 
                      sx={{ maxWidth: '100%' }}
                    />
                  )}
                </Stack>
                
                <Stack direction="row" spacing={1}>
                  {event.status === 'registered' ? (
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<CheckIcon />}
                      disabled
                      sx={{
                        bgcolor: 'success.light',
                        color: 'success.dark',
                        '&.Mui-disabled': { bgcolor: 'success.light', color: 'success.dark' }
                      }}
                    >
                      Registered
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => registerForEvent(event.id)}
                      disabled={loadingStates[event.id] === 'registering'}
                    >
                      {loadingStates[event.id] === 'registering' ? 'Registering...' : 'Register'}
                    </Button>
                  )}
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => router.push(`/events/${event.id}`)}
                  >
                    View Details
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default EventList;