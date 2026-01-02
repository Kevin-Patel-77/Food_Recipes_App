import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: `"Poppins", "Noto Serif", sans-serif`,
    h3: {
      fontWeight: "bold",
      color: "var(--jetGray)",
      fontSize: "24px",
      "@media (min-width:600px)": {
        fontSize: "32px",
      },
      "@media (min-width:900px)": {
        fontSize: "40px",
      },
      "@media (min-width:1200px)": {
        fontSize: "40px",
      },
      "@media (min-width:1536px)": {
        fontSize: "48px",
      },
    },
    h4:{
      fontWeight:"bold"
    },
    h5:{
      fontWeight:"bold"
    }
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          backgroundColor: " #EFE7E2",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "var(--darkCrimson)",
            color: "white",
          },
          borderRadius: "10px",
          fontWeight: "bold",
          textTransform: "none",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            height: "32px",
            borderRadius: "10px",
            backgroundColor: "white",
          },
          "& .MuiInputBase-input": {
            fontSize: "1rem",
            padding: "0 1rem",
          },

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },

          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },

          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },

          "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(",
          },
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          "&.Mui-error": {
            color: "black",
            fontWeight: "bold",
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          textAlign: "left",
          color: "white",
          fontWeight: "bold",
          marginBottom: "0.5rem",

          "&.Mui-error": {
            color: "var(--softCrimson)",
          },
        },
      },
    },
  },
});
