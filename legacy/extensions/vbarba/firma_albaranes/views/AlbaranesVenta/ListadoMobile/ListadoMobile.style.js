export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      // container: {
      //   flexGrow: 1,
      //   minHeight: 500,
      //   paddingLeft: theme.spacing(7) + 1
      // }
      botonPrimarioText: theme.botonPrimarioText,
      botonPrimario: theme.botonPrimarioSmall,
      botonSecundario: theme.botonSecundarioSmall,
    };
  };
};
