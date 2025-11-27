import { Components, Theme } from '@mui/material';

export const components = (theme: Theme): Components => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 500,
        padding: '8px 24px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
          opacity: 0.9,
        },
      },
      contained: {
        background: theme.palette.gradient.primary,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          background: theme.palette.primary.dark,
        },
      },
      outlined: {
        border: `1px solid ${theme.palette.primary.main}`,
        '&:hover': {
          backgroundColor: 'transparent',
          borderColor: theme.palette.primary.dark,
          color: theme.palette.primary.dark,
        },
      },
      text: {
        '&:hover': {
          backgroundColor: 'transparent',
          color: theme.palette.primary.dark,
        },
      },
    },
  },
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
