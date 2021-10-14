import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Perfect DOS VGA",
  },
  palette: {
    primary: {
      main: "#fff",
    },
    secondary: {
      main: "#000",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          backgroundColor: "#00000080",
          ":hover": {
            backgroundColor: "#00000080",
          },
        },
      },
    },
  },
});

export default theme;
