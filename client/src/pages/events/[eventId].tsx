import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn,
  Event as EventIcon,
  Group,
  ArrowBack,
} from '@mui/icons-material';
import { format } from 'date-fns';
import MainDashboardLayout from '@/components/dashboard/MainDashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import EventForm from '@/components/events/EventForm';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import eventsService, { Event, EventRegistration } from '@/services/events.service';

const EventDetailPage = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const { user } = useAuth();
  const { registerForEvent, unregisterFromEvent, loadingStates } = useEvents();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);

  useEffect(() => {
    if (eventId && typeof eventId === 'string') {
      fetchEventDetails();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const eventData = await eventsService.getById(eventId as string);
      setEvent(eventData);

      // Fetch registrations if user is organizer
      if (eventData.organizerId === user?.id) {
        const regs = await eventsService.getEventRegistrations(eventId as string);
        setRegistrations(regs);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!event) return;
    await registerForEvent(event.id);
    await fetchEventDetails(); // Refresh to get updated registration count
  };

  const handleUnregister = async () => {
    if (!event) return;
    await unregisterFromEvent(event.id);
    await fetchEventDetails(); // Refresh to get updated registration count
  };

  const handleUpdateEvent = async (eventData: {
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    maxAttendees?: number;
    imageUrl?: string;
  }) => {
    try {
      await eventsService.update(eventId as string, eventData);
      await fetchEventDetails();
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await eventsService.delete(eventId as string);
      router.push('/events');
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event');
    }
    setShowDeleteDialog(false);
  };

  const isOrganizer = event && user && event.organizerId === user.id;
  const isRegistered = event?.status === 'registered';

  if (loading) {
    return (
      <AuthGuard>
        <MainDashboardLayout title="Event Details">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </MainDashboardLayout>
      </AuthGuard>
    );
  }

  if (error || !event) {
    return (
      <AuthGuard>
        <MainDashboardLayout title="Event Details">
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || 'Event not found'}
            </Alert>
            <Button startIcon={<ArrowBack />} onClick={() => router.push('/events')}>
              Back to Events
            </Button>
          </Container>
        </MainDashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <MainDashboardLayout title={event.title}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/events')}
            sx={{ mb: 3 }}
          >
            Back to Events
          </Button>

          <Card>
            {event.imageUrl && (
              <CardMedia
                component="img"
                height="300"
                image={event.imageUrl}
                alt={event.title}
                sx={{ objectFit: 'cover' }}
              />
            )}

            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {event.title}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <EventIcon color="action" />
                    <Typography variant="body1">
                      {format(new Date(event.startDate), 'PPP')} at{' '}
                      {format(new Date(event.startDate), 'p')}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <LocationOn color="action" />
                    <Typography variant="body1">{event.location}</Typography>
                  </Stack>
                </Box>

                {isOrganizer && (
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => setShowEditForm(true)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => setShowDeleteDialog(true)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                )}
              </Box>

              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Chip
                  icon={<Group />}
                  label={`${event.registrations?.length || 0}/${event.maxAttendees} attendees`}
                  variant="outlined"
                />
                <Chip
                  label={`Organized by ${event.organizer?.name || 'Unknown'}`}
                  variant="outlined"
                />
              </Stack>

              <Box display="flex" gap={2}>
                {isRegistered ? (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleUnregister}
                    disabled={loadingStates[event.id] === 'unregistering'}
                  >
                    {loadingStates[event.id] === 'unregistering' ? 'Unregistering...' : 'Unregister'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleRegister}
                    disabled={loadingStates[event.id] === 'registering'}
                  >
                    {loadingStates[event.id] === 'registering' ? 'Registering...' : 'Register for Event'}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>

          {isOrganizer && registrations.length > 0 && (
            <Card sx={{ mt: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Registrations ({registrations.length})
                </Typography>
                <List>
                  {registrations.map((registration) => (
                    <ListItem key={registration.id}>
                      <ListItemAvatar>
                        <Avatar>
                          {registration.user?.name?.charAt(0) || 'U'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={registration.user?.name || 'Unknown User'}
                        secondary={`Registered on ${format(new Date(registration.registeredAt), 'PPp')}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Container>

        <EventForm
          open={showEditForm}
          onClose={() => setShowEditForm(false)}
          onSubmit={handleUpdateEvent}
          initialData={event}
          isEdit
        />

        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteEvent} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </MainDashboardLayout>
    </AuthGuard>
  );
};

export default EventDetailPage;