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
      cPrimary: {
        backgroundColor: "#2D95C1",
      },
      cSuccess: {
        backgroundColor: "#449D44",
      },
      cWarning: {
        backgroundColor: "#EC971F",
      },
      tdbLineasInventario:  {
        minWidth: '1300px'
      }
    };
  };
};
