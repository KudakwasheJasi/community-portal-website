// src/pages/dashboard/index.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';
import MainDashboardLayout from '@/components/dashboard/MainDashboardLayout';

// Use dynamic import for better performance
const DashboardAnalyticsView = dynamic(
  () => import('@/components/dashboard/DashboardAnalyticsView'),
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
    <MainDashboardLayout title="Dashboard">
      <DashboardAnalyticsView />
    </MainDashboardLayout>
  );
};

export default DashboardPage;