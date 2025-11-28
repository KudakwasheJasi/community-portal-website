// src/pages/dashboard/index.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';
import DashboardLayout from '@/components/DashboardLayout';

// Use dynamic import for better performance
const AdvancedDashboard = dynamic(
  () => import('@/components/dashboard/AdvancedDashboard'),
  { 
    loading: () => (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    )
  }
);

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <AdvancedDashboard />
    </DashboardLayout>
  );
};

export default DashboardPage;