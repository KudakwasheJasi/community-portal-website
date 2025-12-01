import React, { createContext, useMemo, useState, useContext, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, PaletteMode } from '@mui/material';
import { lightTheme, darkTheme } from './index';

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

  const theme = mode === 'light' ? lightTheme : darkTheme;

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