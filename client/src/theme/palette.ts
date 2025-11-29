import { PaletteMode, PaletteOptions } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      primary: string;
      secondary: string;
    };
  }
  interface PaletteOptions {
    gradient: {
      primary: string;
      secondary: string;
    };
  }
}

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode
          primary: {
            main: '#3f51b5',
            light: '#6573c3',
            dark: '#2c387e',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#f50057',
            light: '#f73378',
            dark: '#ab003c',
            contrastText: '#ffffff',
          },
          background: {
            default: '#f5f7fa',
            paper: '#ffffff',
          },
          text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
            disabled: 'rgba(0, 0, 0, 0.38)',
          },
        }
      : {
          // Dark mode
          primary: {
            main: '#90caf9',
            light: '#e3f2fd',
            dark: '#42a5f5',
            contrastText: 'rgba(0, 0, 0, 0.87)',
          },
          secondary: {
            main: '#f48fb1',
            light: '#f8bbd0',
            dark: '#f06292',
            contrastText: 'rgba(0, 0, 0, 0.87)',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: 'rgba(255, 255, 255, 0.5)',
          },
        }),
    // Common colors for both modes
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: mode === 'light' 
        ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        : 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#1e1e1e' : '#3f51b5',
        },
      },
    },
  },
});

export default getDesignTokens;
