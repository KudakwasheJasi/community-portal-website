import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { components } from './components';
import { typography } from './typography';

const theme = createTheme({
  palette,
  typography,
  components: components(createTheme({ palette, typography })),
  shape: {
    borderRadius: 8,
  },
  spacing: 8, // 8px base spacing unit
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

export default theme;
