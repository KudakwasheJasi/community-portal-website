import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { createTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CheckIcon from '@mui/icons-material/Check';
import MainDashboardLayout from '@/components/dashboard/MainDashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import { useEvents } from '@/context/EventContext';
import { Event } from '@/services/events.service';

// --- TYPES ---
export interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  description?: string;
  imageUrl: string;
  isFeatured?: boolean;
  status: 'open' | 'registered' | 'closed';
  tags: string[];
}

export type FilterType = 'All' | 'This Weekend' | 'Online' | 'Free';

const FILTERS: FilterType[] = ['All', 'This Weekend', 'Online', 'Free'];

// Helper function to transform backend event to frontend format
const transformEvent = (event: Event): EventData => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return {
    id: event.id,
    title: event.title,
    date: startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    time: startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    location: event.location,
    description: event.description,
    imageUrl: 'https://via.placeholder.com/400x200?text=' + encodeURIComponent(event.title), // Default image
    isFeatured: false, // Could be determined by some logic
    status: event.status || 'open',
    tags: ['All'], // Default tags
  };
};

// --- COMPONENTS ---

// Event registration page component
const EventsPage = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const { events, loading, error, registerForEvent, unregisterFromEvent, clearError } = useEvents();

  return (
    <AuthGuard>
      <EventsPageContent />
    </AuthGuard>
  );
};

const EventsPageContent = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const { events, loading, error, registerForEvent, unregisterFromEvent, clearError } = useEvents();

  // Transform events to EventData format
  const transformedEvents = useMemo(() =>
    events.map(transformEvent),
    [events]
  );

  const featuredEvents = useMemo(() =>
    transformedEvents.filter(e => e.isFeatured),
    [transformedEvents]
  );

  const listEvents = useMemo(() => {
    let filtered = transformedEvents.filter(e => !e.isFeatured);
    if (activeFilter !== 'All') {
      filtered = transformedEvents.filter(e =>
        !e.isFeatured && e.tags.includes(activeFilter)
      );
    }
    return filtered;
  }, [transformedEvents, activeFilter]);

  const handleRegister = useCallback(async (id: string) => {
    try {
      clearError();
      const currentEvent = transformedEvents.find(e => e.id === id);
      if (!currentEvent) return;

      if (currentEvent.status === 'registered') {
        await unregisterFromEvent(id);
      } else {
        await registerForEvent(id);
      }
    } catch (err: unknown) {
      // Error is handled by the context
    }
  }, [transformedEvents, registerForEvent, unregisterFromEvent, clearError]);

  return (
    <MainDashboardLayout title="Event Registration">
      <Head>
        <title>Event Registration | Community Portal</title>
      </Head>

      <Box sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <FeaturedCarousel
            events={featuredEvents}
            onRegister={handleRegister}
          />
        )}

        {/* Filter Chips */}
        <Box sx={{
          position: 'sticky',
          top: 64, // Height of the AppBar
          zIndex: 10,
          bgcolor: 'background.default',
          pt: 2,
          pb: 1
        }}>
          <FilterChips
            filters={FILTERS}
            activeFilter={activeFilter}
            onFilterSelect={setActiveFilter}
          />
        </Box>

        {/* Event List */}
        <EventList
          events={listEvents}
          onRegister={handleRegister}
        />
          </>
        )}
      </Box>
    </MainDashboardLayout>
  );
};

// 2. FilterChips Component
interface FilterChipsProps {
  filters: FilterType[];
  activeFilter: FilterType;
  onFilterSelect: (filter: FilterType) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ filters, activeFilter, onFilterSelect }) => {
  return (
    <Box sx={{ overflowX: 'auto', py: 2, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
      <Stack direction="row" spacing={1} px={2} minWidth="max-content">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <Chip
              key={filter}
              label={filter}
              onClick={() => onFilterSelect(filter)}
              color={isActive ? 'primary' : 'default'}
              variant={isActive ? 'filled' : 'outlined'}
              sx={{ 
                fontWeight: 500,
                bgcolor: isActive ? 'primary.main' : 'background.paper',
                border: isActive ? 'none' : '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: isActive ? 'primary.dark' : 'action.hover',
                }
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

// 3. FeaturedCarousel Component
interface FeaturedCarouselProps {
  events: EventData[];
  onRegister: (id: string) => void;
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ events, onRegister }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 2 }}>
      <Box sx={{ px: 2 }}>
        <Typography variant="h6" component="h2" fontWeight="bold">
          Featured
        </Typography>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        overflowX: 'auto', 
        gap: 2, 
        px: 2, 
        pb: 2,
        snapType: 'x mandatory',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none'
      }}>
        {events.map((event) => (
          <Card 
            key={event.id} 
            sx={{ 
              minWidth: 280, 
              maxWidth: 320, 
              flex: '0 0 auto', 
              snapAlign: 'center',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CardMedia
              component="img"
              height="160"
              image={event.imageUrl}
              alt={event.title}
            />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box>
                <Typography variant="subtitle1" component="div" fontWeight="bold" noWrap>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.date} • {event.time}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={() => onRegister(event.id)}
                sx={{ mt: 'auto' }}
              >
                Register
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

// 4. EventList Component
interface EventListProps {
  events: EventData[];
  onRegister: (id: string) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onRegister }) => {
  if (events.length === 0) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={4} textAlign="center">
        <EventBusyIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
        <Typography color="text.secondary">No events found in this category.</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} px={2} pb={4}>
      {events.map((event) => (
        <Card key={event.id} sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardMedia
            component="img"
            height="180"
            image={event.imageUrl}
            alt={event.title}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {event.date} • {event.time}
            </Typography>
            <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
              {event.title}
            </Typography>
            
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mt={1}>
              <Box>
                {event.location && (
                  <Typography variant="body1" color="text.secondary">
                    {event.location}
                  </Typography>
                )}
                {event.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {event.description}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box mt={2} display="flex" justifyContent="flex-end">
                {event.status === 'registered' ? (
                  <Button
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
                    variant="contained"
                    onClick={() => onRegister(event.id)}
                  >
                    {event.title.includes('Market') ? 'Join Event' : 'Register'}
                  </Button>
                )}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

// --- COMPONENTS ---

// --- THEME ---

export default EventsPage;
