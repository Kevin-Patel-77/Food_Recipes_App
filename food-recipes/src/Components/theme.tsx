import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          color: "white",
          backgroundImage: 'url("/recipesBg.jpg")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "black",
          color: "gold",
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
            height: "2rem",
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
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
            boxShadow: "none",
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
        },
      },
    },
  },
});
