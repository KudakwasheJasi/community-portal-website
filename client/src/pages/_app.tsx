import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '@/utils/createEmotionCache';
import { ColorModeProvider } from '@/theme/ThemeProvider';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/components/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';

// Define routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password', '/'];

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps } = props;
  const router = useRouter();
  const [emotionCache] = useState(() => createEmotionCache());

  // Remove the server-side injected CSS
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Community Portal</title>
      </Head>
      <AuthProvider>
        <ColorModeProvider>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {publicRoutes.includes(router.pathname) ? (
            <Component {...pageProps} key={router.route} />
          ) : (
            <AuthGuard>
              <Component {...pageProps} key={router.route} />
            </AuthGuard>
          )}
        </ColorModeProvider>
      </AuthProvider>
    </CacheProvider>
  );
}
