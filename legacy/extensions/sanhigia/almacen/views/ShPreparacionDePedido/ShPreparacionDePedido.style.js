export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      referencia: {
        flexGrow: 1,
        marginRight: theme.spacing(1),
      },
      ubicacionBox: {
        marginTop: "15px",
      },
      // preparacionBOX: {
      //   overflow: 'hidden',
      // },
      iconoCabecera: { color: 'black'},
      TablaLineasPedidoCli: {
        width: '1575px'
      },
      ubicacionBox: {
        border: "none !important"
      },
    };
  };
};
