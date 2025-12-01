import { createTheme } from "@mui/material/styles";
import { getDesignTokens } from "./palette";
import { components } from "./components";
import typography from "./typography";

const baseOptions = {
  typography,
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
};

const baseLightTheme = createTheme({
  ...baseOptions,
  ...getDesignTokens('light'),
});

const lightTheme = createTheme({
  ...baseLightTheme,
  components: components(baseLightTheme),
});

const baseDarkTheme = createTheme({
  ...baseOptions,
  ...getDesignTokens('dark'),
});

const darkTheme = createTheme({
  ...baseDarkTheme,
  components: components(baseDarkTheme),
});

export { lightTheme, darkTheme };
