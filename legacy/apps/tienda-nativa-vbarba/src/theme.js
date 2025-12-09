import { mainTheme } from "quimera";

export default {
  palette: {
    ...mainTheme.palette,
    mode: "light",
    primary: {
      light: "#4e933b",
      main: "#4e833b",
      dark: "#4e733b",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#904000",
      main: "#804000",
      dark: "#73400d",
      // main: '#00FF00',
      contrastText: "#ffffff",
    },
  },
  // shape: {
  //   borderRadius: 8
  // },
  // typography: {
  //   htmlFontSize: 14,
  //   button: {
  //     textTransform: 'none',
  //     fontSize: 14
  //   }
  // },
  // button: {
  //   height: '32px'
  //   // marginRight: 4 // usar theme.spacing() modificando la forma de cargar el tema, heredando de uno base o de valores iniciales
  // },
  // textField: {
  //   margin: 4 // usar theme.spacing() modificando la forma de cargar el tema, heredando de uno base o de valores iniciales
  // },
  // props: {
  //   MuiButton: {
  //     // The default props to change
  //     disableElevation: true,
  //     variant: 'contained'
  //   },
  //   MuiTextField: {
  //     // variant: 'outlined'
  //   },
  //   MuiFormControl: {
  //     // variant: 'outlined'
  //   }
  // },
  // overrides: {
  //   MuiTypography: {
  //     body1: {
  //       color: '#000000',
  //       fontSize: '1rem'
  //     },
  //     body2: {
  //       fontSize: '0.875rem',
  //       color: '#576060'
  //     },
  //     subtitle2: {
  //       textTransform: 'uppercase',
  //       color: '#576060',
  //       fontSize: '1.125rem',
  //       fontWeight: '500',
  //       fontStretch: 'normal',
  //       fontStyle: 'normal',
  //       lineHeight: '1.56',
  //       letterSpacing: 'normal'
  //     }
  //   }
  // },
  // botonPrimario: {
  //   backgroundColor: '#3b7e3c',
  //   fontSize: '18px',
  //   color: '#fff',
  //   borderRadius: '5px',
  //   textTransform: 'none',
  //   textAlign: 'center',
  //   fontWeight: 'bold',
  //   padding: '8px 30px',
  //   margin: '10px 1px',
  //   letterSpacing: '0',
  //   willChange: 'box-shadow, transform',
  //   minHeight: '40px',
  //   maxHeight: '40px',
  //   '&:hover': {
  //     backgroundColor: '#3b7e3c',
  //     opacity: '0.8'
  //   }
  // },
  // botonPrimarioSmall: {
  //   backgroundColor: '#3b7e3c',
  //   color: '#fff',
  //   '&:hover': {
  //     backgroundColor: '#3b7e3c',
  //     opacity: '0.8'
  //   }
  // },
  // botonPrimarioText: {
  //   color: '#3b7e3c',
  //   backgroundColor: 'white',
  //   '&:hover': {
  //     backgroundColor: 'white',
  //     opacity: '0.8'
  //   }
  // },
  // botonSecundario: {
  //   color: 'white',
  //   backgroundColor: '#3b7e3c',
  //   marginRight: '7px',
  //   borderRadius: '5px',
  //   '&:hover': {
  //     backgroundColor: '#3b7e3c',
  //     opacity: '0.8'
  //   }
  // },
  // botonSecundarioOutlined: {
  //   color: '#3b7e3c',
  //   backgroundColor: 'white',
  //   border: '1px solid #3b7e3c',
  //   marginRight: '7px',
  //   padding: '6px 16px',
  //   fontWeight: 'bold',
  //   borderRadius: '5px',
  //   '&:hover': {
  //     // backgroundColor: '#f9a825',
  //     opacity: '0.8'
  //   }
  // },
  // botonSecundarioText: {
  //   color: '#3b7e3c',
  //   backgroundColor: 'white',
  //   '&:hover': {
  //     backgroundColor: 'white',
  //     opacity: '0.8'
  //   }
  // }
  custom: {
    menu: {
      light: "#ffffff",
      main: "#4e733b",
      dark: "#4e733b",
      contrastText: "#ffffff",
    },
    scroll: mainTheme.custom.scroll,
  },
};
