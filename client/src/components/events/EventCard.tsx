import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  description?: string;
  imageUrl: string;
  status: 'open' | 'registered' | 'closed';
  onRegister: (id: string) => void;
  onUnregister?: (id: string) => void;
  loading?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  time,
  location,
  description,
  imageUrl,
  status,
  onRegister,
  onUnregister,
  loading = false,
}) => {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"

        height="40"
        image={imageUrl}
        alt={title}
      />
      <CardContent sx={{ pb: 1 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {date} • {time}
        </Typography>
        <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
          {title}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="flex-end" mt={0.5}>
          <Box>
            {location && (
              <Typography variant="body1" color="text.secondary">
                {location}
              </Typography>
            )}
            {description && (
              <Typography variant="body2" color="text.secondary" sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {description}
              </Typography>
            )}
          </Box>
        </Box>
        <Box mt={1.5} display="flex" justifyContent="flex-end">
          {status === 'registered' ? (
            <Box display="flex" gap={1}>
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
              {onUnregister && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => onUnregister(id)}
                  disabled={loading}
                >
                  {loading ? 'Unregistering...' : 'Unregister'}
                </Button>
              )}
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={() => onRegister(id)}
              disabled={loading}
            >
              {loading ? 'Registering...' : (title.includes('Market') ? 'Join Event' : 'Register')}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;
