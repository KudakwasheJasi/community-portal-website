import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
import eventsService, { Event } from '@/services/events.service';

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

// --- CONSTANTS ---
const EVENTS: EventData[] = [
  {
    id: '1',
    title: 'Annual Community Picnic',
    date: 'Sat, Oct 26',
    time: '2:00 PM',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPJaTEXwAda2fs6L9nFrHzdsGWvZXum84bxU_EO-LhUj0iMPHWYjhj5IhlHoEuu7jU9Pljcp03g0m8b3XX2Sj8Nv23HgLnEd0xrYVeTq3wOo8No4PBRzg2knM9GBpNPSy3wj0RvcFOwg7g5iiKfTEHvcmEtWjwzii4Msl9LPVpuNrINbwD06VjlUD5V14FJqboW3DhcbbwnixCElan4aJUtDAQgaW7WmgfWYneD8GLmWbeRhUpawTOx2QII-ioUfP35OqIcUllYBVC',
    isFeatured: true,
    status: 'open',
    location: 'Central Park',
    description: 'Join us for a day of fun, food, and games!',
    tags: ['All', 'This Weekend', 'Free']
  },
  {
    id: '2',
    title: 'Local Tech Meetup',
    date: 'Tues, Oct 29',
    time: '6:00 PM',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACkIrlloAM8IKGwjE9AxxJ7ql87HQGFcCV8Jllzf_UQz9HtSUZYP_NbBWtwmHluxL9Gmr3KGUtR1klmrvXKab70uaycNStvJClEMle5D1Us-7j0qhpTF7tG4hlFkSsn-7lNgyYqHwbX1l5iWaLjTvWOGx24u2NiHB1wtaVjC6WZresrIZKvtmZie-6KcaxNHt8ypngIrRG4g7Vb70IxlR8KKytCtCFqItgTAeBuYCQI8lmwtGRmKdEYl_AzF3OZLwlJYO5iPoKY4xl',
    isFeatured: true,
    status: 'open',
    tags: ['All', 'Online', 'Free']
  },
  {
    id: '3',
    title: 'Annual Community Picnic',
    date: 'Sat, Oct 26',
    time: '2:00 PM',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyLmjpiZZpSbtd0YjB5RQUrdm9d5cI5nshGoOPv92E2ybFMBp06N_SxTWETJhGFnIYiNsFSL2tGxXJ-zXf8EWUq_BTH5UWLA7qic4C4ZR5vtIadABOp8SR0jb0pjCBGRXSUSmGQ7Z7XXYcP7BZawmL0cfplJVGjRLErZkV2MgxLYHfS9Euv1805RhWqKRUHfWcEzftLEX2PChUXJyXQIgu9hmKhB7FmMYl_lMd2r6W28bHRXeLEmTBmMZ6usJbqPYVofAjOscx1ynp',
    isFeatured: false,
    status: 'open',
    location: 'Central Park',
    description: 'Join us for a day of fun, food, and games!',
    tags: ['All', 'This Weekend', 'Free']
  },
  {
    id: '4',
    title: 'Morning Yoga Session',
    date: 'Sun, Oct 27',
    time: '8:00 AM',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm4j3WAPRNBrAQ6GN1ElZQGzUoL5bBxllCz8rr5Bf6YBHxQYdfQLGC7n-H7qH4jmrEBc8vY9GSaN4C-W8ptxMusmyVr0tJX2MgzbBUs-ZTfK7saPRJWbLiKxxe0FyJAoV8yoPskgL1JnmWaWrSD4i-XI2prXacWuOfYya8_NxNGlNKBvftN8nDwCrEMwX3fmlAclcQIE_Pl758Fac89I2pNc3G7xSX7yGGrn2uGxqGcu1-nP7ee9AlfgrrveMqkA1Ex4_xwPSnhYSr',
    isFeatured: false,
    status: 'registered',
    location: 'Online',
    description: 'Start your day with a calming yoga session.',
    tags: ['All', 'Online', 'This Weekend']
  },
  {
    id: '5',
    title: 'Neighborhood Farmers Market',
    date: 'Wed, Oct 30',
    time: '4:00 PM',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAapgQiOgg2r2Kw7B_zEnzw8HQSFrEJFKgqkTVnbhDbLtrCQu2mMkgc_8bLvSrz90Td7prENyI54PUSbl-EfIqe4YbO3sCxp_23MIENhMDb0CTOhH6HfFkewpLXpQWCY0e9vi1LXA-PHLDx2TKJhZvhzxhxtyneimWohIT5p9tgVhuy2pwt6uQDSFOZZEmeo5gzBwYzp7y_Hq3dduiDuHfPW0Pb79F8TwI5uCgbbIUsNRWB5WH_uJE_6qQwqARMP_teBBIIOhdylosp',
    isFeatured: false,
    status: 'open',
    location: 'Town Square',
    description: 'Support local vendors and buy fresh produce.',
    tags: ['All', 'Free']
  }
];

const FILTERS: FilterType[] = ['All', 'This Weekend', 'Online', 'Free'];

// --- COMPONENTS ---

// Event registration page component
const EventsPage = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError('');
        const fetchedEvents = await eventsService.getAll();
        setEvents(fetchedEvents);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const featuredEvents = useMemo(() => 
    events.filter(e => e.isFeatured), 
  [events]);

  const listEvents = useMemo(() => {
    let filtered = events.filter(e => !e.isFeatured);
    if (activeFilter !== 'All') {
      filtered = events.filter(e => 
        !e.isFeatured && e.tags.includes(activeFilter)
      );
    }
    return filtered;
  }, [events, activeFilter]);

  const handleRegister = useCallback(async (id: string) => {
    try {
      setError('');
      const currentEvent = events.find(e => e.id === id);
      if (!currentEvent) return;

      if (currentEvent.status === 'registered') {
        await eventsService.unregisterFromEvent(id);
        setEvents(prev => prev.map(event =>
          event.id === id ? { ...event, status: 'open' } : event
        ));
      } else {
        await eventsService.registerForEvent(id);
        setEvents(prev => prev.map(event =>
          event.id === id ? { ...event, status: 'registered' } : event
        ));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update registration');
    }
  }, [events]);

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
