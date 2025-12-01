import { Components, Theme } from '@mui/material';
import Button from './Button';
import Input from './Input';

export const components = (theme: Theme): Components<Theme> => ({
  ...Input(theme),
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          '& fieldset': {
            borderColor: theme.palette.grey[300],
          },
          '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: 1,
          },
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        '&:hover': {
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        cursor: 'pointer',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
  },
});

export default components;
