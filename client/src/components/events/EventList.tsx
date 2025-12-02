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
  IconButton,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Event } from '@/services/events.service';
import { useRouter } from 'next/router';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';

interface EventListProps {
  events: Event[];
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onEdit, onDelete }) => {
  const router = useRouter();
  const { registerForEvent, unregisterFromEvent, loadingStates } = useEvents();
  const { user } = useAuth();

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
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
          <Box sx={{ position: 'relative', height: '100%' }}>
            {/* Action buttons - always visible if user owns the event */}
            {(onEdit || onDelete) && user && event.organizerId === user.id && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  display: 'flex',
                  gap: 0.5,
                  zIndex: 20,
                }}
              >
                {onEdit && (
                  <IconButton
                    size="small"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      if (onEdit) onEdit(event);
                    }}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: 2,
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        boxShadow: 3,
                        transform: 'scale(1.05)'
                      },
                      width: 36,
                      height: 36,
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
                {onDelete && (
                  <IconButton
                    size="small"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      if (onDelete) onDelete(event.id);
                    }}
                    sx={{
                      bgcolor: 'white',
                      color: 'error.main',
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: 2,
                      '&:hover': {
                        bgcolor: 'error.main',
                        color: 'white',
                        boxShadow: 3,
                        transform: 'scale(1.05)'
                      },
                      width: 36,
                      height: 36,
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            )}

            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                  transition: 'all 0.3s ease-in-out',
                },
              }}
            >
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  paragraph
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    mb: 2,
                  }}
                >
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
                          '&.Mui-disabled': { bgcolor: 'success.light', color: 'success.dark' },
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
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default EventList;