import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: `"Noto Serif", serif`,
  },

  palette:{
      primary:{
        main:"#EF4444"
      }, 
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
            backgroundColor: "#E53935",
            color:"white"
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

          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },

          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },

          "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#EF4444",
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
            color: "#EF4444",
          },
        },
      },
    },
  },
});
