import { useState, useEffect } from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import createEmotionCache from '@/utils/createEmotionCache';
import { ColorModeProvider } from '@/theme/ThemeProvider';

// Dynamically import components that shouldn't be server-side rendered
const Toaster = dynamic(
  () => import('react-hot-toast').then((c) => c.Toaster),
  { ssr: false }
);

// Create a client-side only wrapper for components that use browser APIs
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
};

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
const queryClient = new QueryClient();

// Define routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password', '/'];

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const App = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();

  // Remove the server-side injected CSS
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  // Client-side only wrapper
  const ClientOnly = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return null;
    }

    return <>{children}</>;
  };

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Community Portal</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <ColorModeProvider>
          <CssBaseline />
          <Toaster position="top-right" />
          <AuthProvider>
            <Component {...pageProps} key={router.route} />
          </AuthProvider>
        </ColorModeProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
};

export default App;
