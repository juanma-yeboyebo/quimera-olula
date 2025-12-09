import { mainTheme } from "quimera";

const secondaryMain = "#D95578";
const primaryMain = "#f25e86";
export default {
  ...mainTheme,
  palette: {
    ...mainTheme.palette,
    mode: "light",
    primary: {
      main: primaryMain,
      dark: "#42ADAA",
      contrastText: "#ffffff",
    },
    secondary: {
      main: secondaryMain,
      contrastText: "#ffffff",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
    common: {
      button: "#225DD4",
      seleccionado: "#DC5B80",
      ok: "#4caf50",
      white: "#ffffff",
    },
  },
  custom: {
    menu: {
      ...mainTheme.custom.menu,
      main: "#a13f59",
      accent: primaryMain,
      alternative: secondaryMain,
    },
    scroll: {
      ...mainTheme.custom.scroll,
      main: "#222",
      alternative: "#6f6f6f",
      light: "#9b9b9b",
    },
  },
};
