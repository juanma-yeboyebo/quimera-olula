export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      textoEnviando: {
        margin: "0px 19px 0px 19px",
        color: theme.palette.secondary.main,
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: 1.75,
        letterSpacing: "0.02857em",
      },
    };
  };
};
