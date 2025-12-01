import { PaletteMode, PaletteOptions } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      primary: string;
      secondary: string;
      background: string;
    };
  }
  interface PaletteOptions {
    gradient: {
      primary: string;
      secondary: string;
      background: string;
    };
  }
}

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode - Modern Community Portal Theme
          primary: {
            main: '#6366f1', // Indigo-500
            light: '#818cf8', // Indigo-400
            dark: '#4f46e5', // Indigo-600
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#ec4899', // Pink-500
            light: '#f472b6', // Pink-400
            dark: '#db2777', // Pink-600
            contrastText: '#ffffff',
          },
          background: {
            default: '#fafbfc', // Very light gray
            paper: '#ffffff',
            alt: '#f8fafc', // Slightly different shade for variety
          },
          text: {
            primary: '#1e293b', // Slate-800
            secondary: '#64748b', // Slate-500
            disabled: '#94a3b8', // Slate-400
          },
          divider: '#e2e8f0', // Slate-200
        }
      : {
          // Dark mode - Modern Dark Theme
          primary: {
            main: '#818cf8', // Indigo-400
            light: '#a5b4fc', // Indigo-300
            dark: '#6366f1', // Indigo-500
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#f472b6', // Pink-400
            light: '#fb7185', // Rose-400
            dark: '#ec4899', // Pink-500
            contrastText: '#ffffff',
          },
          background: {
            default: '#0f172a', // Slate-900
            paper: '#1e293b', // Slate-800
            alt: '#334155', // Slate-700
          },
          text: {
            primary: '#f1f5f9', // Slate-100
            secondary: '#cbd5e1', // Slate-300
            disabled: '#64748b', // Slate-500
          },
          divider: '#334155', // Slate-700
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
      background: mode === 'light'
        ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
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
