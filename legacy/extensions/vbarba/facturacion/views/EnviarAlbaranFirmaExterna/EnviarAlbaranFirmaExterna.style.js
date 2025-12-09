export default parent => {
  return theme => {
    // const _p = parent(theme)
    return {
      // ..._p,
      // container: {
      //   flexGrow: 1,
      //   minHeight: 500,
      //   paddingLeft: theme.spacing(7) + 1
      // }
      cabeceraEnviarFirmaTitulo: {
        borderBottom: "1px solid black",
        fontSize: "1.2em",
        fontWeight: "600",
        textAlign: "center",
        // paddingLeft: spacing(1),
        // paddingRight: spacing(1)
      },
      botonPrimarioText: theme.botonPrimarioText,
      botonSecundarioText: theme.botonSecundarioText,
    };
  };
};
