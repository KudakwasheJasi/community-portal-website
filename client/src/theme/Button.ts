import type { Components, Theme } from "@mui/material";

const Button = (theme: Theme): Components => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        textTransform: "none",
        padding: `8px 20px`,
        fontSize: "14px",
        boxShadow: "none",
        textDecoration: "none",
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        transition: 'transform .1s ease-in-out,background-color .1s ease-in-out,filter .1s ease-in-out',
        "&:focus": {
          boxShadow: "none",
          outline: "none",
        },
        "&:hover": {
          outline: "none",
          textDecoration: "none",
          filter: "drop-shadow(0 0.125em 1.25em rgba(71, 71, 135,.6))",
          transform: "translate3d(0, -0.1em, 0) scale(1.01)",
        },
      },
      containedPrimary: {
        backgroundColor: theme.palette.primary.main,
      },
      outlinedPrimary: {
        borderWidth: 2,
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        backgroundColor: "#fff",
        "&:hover": {
          backgroundColor: theme.palette.primary.main,
          color: "#fff",
          borderColor: theme.palette.primary.main,
        },
      },
    },
  },
});

export default Button;
