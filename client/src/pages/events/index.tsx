// client/src/pages/events/index.tsx
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Typography,
  Button,
  Container,
  Alert,
  CircularProgress,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainDashboardLayout from '@/components/dashboard/MainDashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import EventList from '@/components/events/EventList';
import EventForm from '@/components/events/EventForm';
import { useEvents } from '@/context/EventContext';
import eventsService, { CreateEventData } from '@/services/events.service';

const EventsPage = () => {
  const router = useRouter();
  const [showEventForm, setShowEventForm] = useState(false);
  const { events, loading, error, fetchEvents } = useEvents();

  const handleCreateEvent = useCallback(async (eventData: CreateEventData) => {
    try {
      await eventsService.create(eventData);
      await fetchEvents(); // Refresh events after creation
    } catch (error) {
      console.error('Error creating event:', error);
    }
  }, [fetchEvents]);

  return (
    <AuthGuard>
      <MainDashboardLayout title="Events">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1">
              Upcoming Events
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setShowEventForm(true)}
            >
              Create Event
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" my={8}>
              <CircularProgress />
            </Box>
          ) : (
            <EventList events={events} />
          )}
        </Container>

        <Fab
          color="primary"
          aria-label="add event"
          sx={{ position: 'fixed', bottom: 32, right: 32 }}
          onClick={() => setShowEventForm(true)}
        >
          <AddIcon />
        </Fab>

        <EventForm
          open={showEventForm}
          onClose={() => setShowEventForm(false)}
          onSubmit={handleCreateEvent}
        />
      </MainDashboardLayout>
    </AuthGuard>
  );
};

export default EventsPage;