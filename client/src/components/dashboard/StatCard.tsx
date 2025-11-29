import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import { NorthEast, SouthEast } from '@mui/icons-material';
import { StatData } from './types';

interface StatCardProps {
  data: StatData;
}

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const Icon = data.icon;
  const theme = useTheme();

  let trendColor = theme.palette.text.secondary;
  let TrendIcon = null;

  if (data.trend === 'up') {
    trendColor = theme.palette.success.main;
    TrendIcon = NorthEast;
  } else if (data.trend === 'down') {
    trendColor = theme.palette.error.main;
    TrendIcon = SouthEast;
  }

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.02)' },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
              }}
            >
              <Icon sx={{ fontSize: 18 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {data.label}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            <Typography variant="h5" fontWeight={700}>
              {data.value}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: trendColor }}>
              {TrendIcon && <TrendIcon sx={{ fontSize: 14 }} />}
              <Typography variant="caption" fontWeight={700}>
                {data.trendValue}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StatCard;
export type { StatData };