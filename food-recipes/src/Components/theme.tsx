import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          background: "linear-gradient(135deg, #fff9c4, #ffe0b2)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#ff8c00",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#ff6f00",
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

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },

          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "white",
            },

          "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#ff6f00",
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
            color: "#ff6f00",
          },
        },
      },
    },
  },
});
