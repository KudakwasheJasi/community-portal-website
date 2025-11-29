import React from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';
import EventCard from './EventCard';
import { Event } from '@/services/events.service';

interface UpcomingEventsSectionProps {
  events: Event[];
}

const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({ events }) => {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} px={0.5}>
        <Typography variant="h6">Upcoming Events</Typography>
        <Button size="small" sx={{ fontWeight: 600 }}>See All</Button>
      </Stack>
      <Box
        className="no-scrollbar"
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 1,
          mx: -2,
          px: 2,
        }}
      >
        {events.map((event) => (
          <EventCard key={event.id} data={event} />
        ))}
      </Box>
    </Box>
  );
};

export default UpcomingEventsSection;