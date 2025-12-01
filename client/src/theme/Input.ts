import type { Components, Theme } from "@mui/material";

const Input = (theme: Theme): Components<Theme> => ({
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        minHeight: 55,
        borderRadius: 10,
        paddingTop: 12,
        paddingRight: 16,
        paddingBottom: 12,
        paddingLeft: 16,
        borderWidth: 2,
        marginBottom: 25,
        color: theme.palette.text.primary,
        backgroundColor: 'transparent !important',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.text.primary,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
        transition: theme.transitions.create(["border-color", "box-shadow"], {
          duration: theme.transitions.duration.short,
        }),
        "&:-webkit-autofill": {
          WebkitBoxShadow: `0 0 0 1000px transparent inset !important`,
          WebkitTextFillColor: `${theme.palette.text.primary} !important`,
          caretColor: theme.palette.text.primary,
          borderRadius: "inherit",
          transition: 'background-color 5000s ease-in-out 0s',
        },
        "&:-webkit-autofill:focus": {
          WebkitBoxShadow: `0 0 0 1000px transparent inset !important`,
          WebkitTextFillColor: `${theme.palette.text.primary} !important`,
        },
        "&:-webkit-autofill:hover": {
          WebkitBoxShadow: `0 0 0 1000px transparent inset !important`,
          WebkitTextFillColor: `${theme.palette.text.primary} !important`,
        },
        "& input": {
          padding: 0,
          height: "100%",
          boxSizing: "border-box",
          backgroundColor: "transparent",
          color: theme.palette.text.primary,
          WebkitTextFillColor: theme.palette.text.primary,
          "&::placeholder": {
            color: theme.palette.text.secondary,
            opacity: 1,
          },

          "&:-webkit-autofill": {
            boxShadow: `0 0 0 1000px transparent inset !important`,
            WebkitTextFillColor: `${theme.palette.text.primary} !important`,
            caretColor: theme.palette.text.primary,
            borderRadius: "inherit",
            transition: 'background-color 5000s ease-in-out 0s',
            backgroundClip: "content-box !important",
          },
          "&:-webkit-autofill:focus": {
            boxShadow: '0 0 0 1000px transparent inset !important',
            WebkitTextFillColor: `${theme.palette.text.primary} !important`,
            backgroundColor: 'transparent !important',
          },
          "&:-webkit-autofill:hover": {
            boxShadow: '0 0 0 1000px transparent inset !important',
            WebkitTextFillColor: `${theme.palette.text.primary} !important`,
            backgroundColor: 'transparent !important',
          },
        },

        "&.small-input": {
          minHeight: 32,
          height: 32,
        },
        "&.Mui-focused": {
          backgroundColor: 'transparent !important',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: `${theme.palette.primary.main} !important`,
            borderWidth: '2px !important',
          },
        },

        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
          {
            WebkitAppearance: "none",
            margin: 0,
          },
        "& input[type=number]": {
          MozAppearance: "textfield",
        },

        "&.valid-input": {
          borderColor: theme.palette.success.main,
          "&:hover": {
            borderColor: theme.palette.success.dark,
          },
          "&.Mui-focused": {
            borderColor: theme.palette.success.dark,
            boxShadow: `0 0 0 2px ${theme.palette.success.light}`,
          },
        },
        "&.MuiOutlinedInput-multiline": {
          height: "auto",
          paddingTop: 8,
          paddingBottom: 8,
          "& textarea": {
            height: "auto !important",
            minHeight: 100,
            padding: 0,
            resize: "vertical",
          },
        },
        "&.MuiOutlinedInput-multiline input": {
          height: "auto",
        },
        "&.Mui-error": {
          marginBottom: 0,
        },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      select: {
        paddingTop: 0,
        paddingBottom: 0,
        display: "flex",
        alignItems: "center",
      },
    },
  },
});

export default Input;
