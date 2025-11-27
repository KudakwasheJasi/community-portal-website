import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  Box,
  Typography,
  CircularProgress,
  Backdrop,
  useTheme
} from '@mui/material';

export default function Home() {
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    // Navigate to login page after 3 seconds
    const timer = setTimeout(() => {
      router.push('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Head>
        <title>Loading...</title>
        <meta name="description" content="Loading community portal" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Backdrop
        sx={{
          backgroundColor: theme.palette.background.default,
          zIndex: theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
        open={true}
      >
        <Typography variant="h5" color="text.primary">
          Loading Community Portal
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={24} color="primary" />
          <Typography variant="body1" color="text.secondary">
            Redirecting to login...
          </Typography>
        </Box>
      </Backdrop>
    </>
  );
}
