import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import eventsService, { Event, EventRegistration } from '@/services/events.service';
import { useAuth } from '@/context/AuthContext';

interface EventContextType {
  events: Event[];
  loading: boolean;
  error: string | null;
  loadingStates: Record<string, 'registering' | 'unregistering' | null>;
  fetchEvents: () => Promise<void>;
  registerForEvent: (id: string) => Promise<{ success: boolean; message?: string }>;
  unregisterFromEvent: (id: string) => Promise<{ success: boolean; message?: string }>;
  clearError: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, 'registering' | 'unregistering' | null>>({});

  const fetchEvents = async () => {
    if (!isAuthenticated || !user) {
      setEvents([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching events...');

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
    if (!isAuthenticated || !user) {
      return { success: false, message: 'Please log in to register for events' };
    }

    try {
      setLoadingStates(prev => ({ ...prev, [id]: 'registering' }));
      
      // Optimistic update
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === id
            ? { ...event, status: 'registered' as const }
            : event
        )
      );

      await eventsService.registerForEvent(id);
      
      // Final update with fresh data
      await fetchEvents();
      
      return { success: true };
    } catch (err) {
      // Revert optimistic update on error
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === id
            ? { ...event, status: 'open' as const }
            : event
        )
      );
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to register for event';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: null }));
    }
  };

  const unregisterFromEvent = async (id: string) => {
    if (!isAuthenticated || !user) {
      return { success: false, message: 'Please log in to unregister from events' };
    }

    try {
      setLoadingStates(prev => ({ ...prev, [id]: 'unregistering' }));
      
      // Optimistic update
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === id
            ? { ...event, status: 'open' as const }
            : event
        )
      );

      await eventsService.unregisterFromEvent(id);
      
      // Final update with fresh data
      await fetchEvents();
      
      return { success: true };
    } catch (err) {
      // Revert optimistic update on error
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === id
            ? { ...event, status: 'registered' as const }
            : event
        )
      );
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to unregister from event';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: null }));
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchEvents();
    } else {
      // Clear events when not authenticated
      setEvents([]);
      setError(null);
    }
  }, [isAuthenticated, user]);

  const value = {
    events,
    loading,
    error,
    loadingStates,
    fetchEvents,
    registerForEvent,
    unregisterFromEvent,
    clearError,
  };

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        error,
        loadingStates,
        fetchEvents,
        registerForEvent,
        unregisterFromEvent,
        clearError,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export default EventContext;
