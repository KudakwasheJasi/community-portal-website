import React from 'react';
import { Box } from '@mui/material';
import StatCard from './StatCard';
import { StatData } from './types';

interface StatsSectionProps {
  stats: StatData[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 2,
      }}
    >
      {stats.map((stat) => (
        <StatCard key={stat.id} data={stat} />
      ))}
    </Box>
  );
};

export default StatsSection;