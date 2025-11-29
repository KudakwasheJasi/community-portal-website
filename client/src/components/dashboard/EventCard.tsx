import React from 'react';
import {
  Box,
  Typography,
  Card,
  Stack,
  Avatar,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { Event } from '@/services/events.service';

interface EventCardProps {
  data: Event;
}

const EventCard: React.FC<EventCardProps> = ({ data }) => {
  return (
    <Card
      sx={{
        minWidth: 280,
        maxWidth: 280,
        flexShrink: 0,
        position: 'relative',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 4 },
      }}
    >
      <Box
        sx={{
          height: 128,
          width: '100%',
          backgroundImage: `url(${data.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
          }}
        />
        <Box sx={{ position: 'absolute', bottom: 12, left: 12, right: 12, color: 'white' }}>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
            {data.title}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500 }}>
            {data.date} • {data.time}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
          <LocationOn sx={{ fontSize: 16 }} />
          <Typography variant="caption" fontWeight={600}>
            {data.location || 'TBD'}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={-0.75} alignItems="center">
          {[1, 2].map((i) => (
            <Avatar
              key={i}
              src={`https://picsum.photos/seed/attendee${i}${data.id}/100`}
              sx={{
                width: 24,
                height: 24,
                border: '2px solid white',
              }}
            />
          ))}
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: 'background.default',
              border: '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 700,
              color: 'text.secondary',
              zIndex: 1,
            }}
          >
            +12
          </Box>
        </Stack>
      </Box>
    </Card>
  );
};

export default EventCard;