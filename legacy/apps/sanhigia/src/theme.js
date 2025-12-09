import { mainTheme } from "quimera";

const secondaryMain = "#6666FF";
const primaryMain = "#ce001e";
export default {
  ...mainTheme,
  palette: {
    ...mainTheme.palette,
    mode: "light",
    common: {
      button: "#225DD4",
      seleccionado: "#DC5B80",
      ok: "#4caf50",
      white: "#ffffff",
    },
    // primary: {
    //   main: primaryMain,
    //   contrastText: "#ffffff",
    // },
    // secondary: {
    //   main: secondaryMain,
    //   contrastText: "#ffffff",
    // },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    htmlFontSize: 14,
    button: {
      textTransform: "none",
      fontSize: 14,
    },
  },
  button: {
    height: "32px",
    // marginRight: 4 // usar theme.spacing() modificando la forma de cargar el tema, heredando de uno base o de valores iniciales
  },
  textField: {
    margin: 4, // usar theme.spacing() modificando la forma de cargar el tema, heredando de uno base o de valores iniciales
  },
  props: {
    MuiButton: {
      // The default props to change
      disableElevation: true,
      variant: "contained",
    },
    MuiTextField: {
      // variant: 'outlined'
    },
    MuiFormControl: {
      // variant: 'outlined'
    },
  },
  overrides: {
    MuiTypography: {
      body1: {
        color: "#000000",
        fontSize: "1.2rem",
      },
      body2: {
        fontSize: "0.875rem",
        color: "#576060",
      },
      subtitle2: {
        textTransform: "uppercase",
        color: "#576060",
        fontSize: "1.125rem",
        fontWeight: "500",
        fontStretch: "normal",
        fontStyle: "normal",
        lineHeight: "1.56",
        letterSpacing: "normal",
      },
      overline: {
        textTransform: "uppercase",
        margin: "0px",
        lineHeight: "1.56",
        // fontStretch: 'normal',
        // fontStyle: 'normal',
        // lineHeight: '1.56',
        // letterSpacing: 'normal'
      },
    },
  },
  botonPrimario: {
    "backgroundColor": "#ce001e",
    "fontSize": "18px",
    "color": "#fff",
    "borderRadius": "5px",
    "textTransform": "none",
    "textAlign": "center",
    "fontWeight": "bold",
    "padding": "8px 30px",
    "margin": "10px 1px",
    "letterSpacing": "0",
    "willChange": "box-shadow, transform",
    "minHeight": "40px",
    "maxHeight": "40px",
    "&:hover": {
      backgroundColor: "#ce001e",
      opacity: "0.8",
    },
  },
  hoverPointer: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  custom: {
    menu: {
      ...mainTheme.custom.menu,
      main: "#222",
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
