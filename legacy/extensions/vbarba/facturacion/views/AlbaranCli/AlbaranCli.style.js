export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      referencia: {
        flexGrow: 1,
        marginRight: theme.spacing(1),
      },
      cantidad: {
        maxWidth: 80,
        marginRight: theme.spacing(1),
      },
      iconoIzquierda: {
        marginRight: theme.spacing(1),
      },
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
