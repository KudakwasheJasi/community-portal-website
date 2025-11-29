import React, { createContext, useMemo, useState, useContext, useEffect, ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, PaletteMode } from '@mui/material';
import { getDesignTokens } from './palette';
import { components } from './components';
import { typography } from './typography';

type ColorModeContextType = {
  mode: PaletteMode;
  toggleColorMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>({
  mode: 'light',
  toggleColorMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

interface ColorModeProviderProps {
  children: ReactNode;
}

export const ColorModeProvider: React.FC<ColorModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>('light');

  // Initialize theme mode from localStorage or system preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('colorMode') as PaletteMode;
      if (savedMode) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMode(savedMode);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMode('dark');
      }
    }
  }, []);

  const theme = useMemo(() => {
    const designTokens = getDesignTokens(mode);
    return createTheme({
      ...designTokens,
      typography,
      components: components(createTheme({ ...designTokens, typography })),
      shape: {
        borderRadius: 8,
      },
      spacing: 8,
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 900,
          lg: 1200,
          xl: 1536,
        },
      },
      transitions: {
        duration: {
          shortest: 150,
          shorter: 200,
          short: 250,
          standard: 300,
          complex: 375,
          enteringScreen: 225,
          leavingScreen: 195,
        },
      },
      zIndex: {
        mobileStepper: 1000,
        speedDial: 1050,
        appBar: 1100,
        drawer: 1200,
        modal: 1300,
        snackbar: 1400,
        tooltip: 1500,
      },
    });
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('colorMode', newMode);
          return newMode;
        });
      },
    }),
    [mode]
  );

  // Add class to body for better CSS theming support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.className = `theme-${mode}`;
      document.body.style.backgroundColor = mode === 'dark' ? '#121212' : '#f5f7fa';
    }
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};