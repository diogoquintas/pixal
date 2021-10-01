import { createTheme } from "@mui/material/styles";
import { MAIN_COLOR, SECONDARY_COLOR } from "../App";

const theme = createTheme({
  typography: {
    fontFamily: "Perfect DOS VGA",
  },
  palette: {
    primary: {
      main: MAIN_COLOR,
    },
    secondary: {
      main: SECONDARY_COLOR,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          backgroundColor: "black",
          ":hover": {
            backgroundColor: "black",
          },
        },
      },
    },
  },
});

export default theme;
