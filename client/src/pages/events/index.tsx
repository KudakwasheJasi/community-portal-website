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
import eventsService, { CreateEventData, Event } from '@/services/events.service';
import { NotificationSounds } from '@/utils/notificationSounds';

const EventsPage = () => {
  const router = useRouter();
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { events, loading, error, fetchEvents } = useEvents();

  const handleCreateEvent = useCallback(async (eventData: CreateEventData) => {
    try {
      await eventsService.create(eventData);
      await fetchEvents(); // Refresh events after creation
      // Play success sound for event creation
      NotificationSounds.playCreation();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  }, [fetchEvents]);

  const handleEditEvent = useCallback(async (eventData: CreateEventData) => {
    try {
      if (editingEvent) {
        await eventsService.update(editingEvent.id, eventData);
        await fetchEvents(); // Refresh events after update
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  }, [editingEvent, fetchEvents]);

  const handleDeleteEvent = useCallback(async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsService.delete(eventId);
        await fetchEvents(); // Refresh events after deletion
      } catch (error: any) {
        console.error('Error deleting event:', error);
        alert(`Failed to delete event: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      }
    }
  }, [fetchEvents]);

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const openCreateDialog = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

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
              onClick={openCreateDialog}
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
            <EventList
              events={events}
              onEdit={openEditDialog}
              onDelete={handleDeleteEvent}
            />
          )}
        </Container>

        <Fab
          color="primary"
          aria-label="add event"
          sx={{ position: 'fixed', bottom: 32, right: 32 }}
          onClick={openCreateDialog}
        >
          <AddIcon />
        </Fab>

        <EventForm
          open={showEventForm}
          onClose={() => setShowEventForm(false)}
          onSubmit={editingEvent ? handleEditEvent : handleCreateEvent}
          isEdit={!!editingEvent}
          initialData={editingEvent || undefined}
        />
      </MainDashboardLayout>
    </AuthGuard>
  );
};

export default EventsPage;