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
      preparacionBOX: {
        overflow: "hidden",
      },
      paper38auto: { minWidth: "38.5%", minHeight: "auto" },
      iconoCabecera: { color: 'black'},
      TablaLineasPedidoCli: {
        width: '1280px'
      }
    };
  };
};
