export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      verde: {
        color: "green",
      },
      rojo: {
        color: "red",
      },
      pago: {
        backgroundColor: `${theme.palette.error.main}`,
        marginRight: "10px",
      },
      cobro: {
        backgroundColor: `${theme.palette.success.main}`,
        marginRight: "10px",
      },
      manual: {
        backgroundColor: `${theme.palette.info.main}`,
        marginRight: "10px",
      },
    };
  };
};
