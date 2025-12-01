import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import eventsService, { Event, EventRegistration } from '@/services/events.service';

interface EventContextType {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  registerForEvent: (id: string) => Promise<void>;
  unregisterFromEvent: (id: string) => Promise<void>;
  clearError: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching events...');

      // Always fetch events (doesn't require auth)
      const fetchedEvents = await eventsService.getAll();
      console.log('Fetched events:', fetchedEvents);

      let eventsWithStatus = fetchedEvents.map(event => ({
        ...event,
        status: 'open' as 'open' | 'registered' | 'closed'
      }));

      // Try to fetch user registrations (requires auth)
      try {
        const userRegistrations = await eventsService.getUserRegistrations();
        console.log('User registrations:', userRegistrations);

        // Create a set of registered event IDs for quick lookup
        const registeredEventIds = new Set(userRegistrations.map(reg => reg.eventId));

        // Update events with registration status
        eventsWithStatus = fetchedEvents.map(event => ({
          ...event,
          status: (registeredEventIds.has(event.id) ? 'registered' : 'open') as 'open' | 'registered' | 'closed'
        }));
      } catch (regError) {
        console.log('User not authenticated or registration fetch failed, showing events as open');
        // User is not logged in, keep events as 'open' status
      }

      console.log('Events with status:', eventsWithStatus);
      setEvents(eventsWithStatus);
    } catch (err: unknown) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = async (id: string) => {
    try {
      setError(null);
      await eventsService.registerForEvent(id);
      setEvents(prev => prev.map(event =>
        event.id === id ? { ...event, status: 'registered' } : event
      ));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register for event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const unregisterFromEvent = async (id: string) => {
    try {
      setError(null);
      await eventsService.unregisterFromEvent(id);
      setEvents(prev => prev.map(event =>
        event.id === id ? { ...event, status: 'open' } : event
      ));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unregister from event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const value = {
    events,
    loading,
    error,
    fetchEvents,
    registerForEvent,
    unregisterFromEvent,
    clearError,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export default EventContext;
