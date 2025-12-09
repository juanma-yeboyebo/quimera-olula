export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      container: {
        padding: 0,
      },
      cosido: {
        backgroundColor: `${theme.palette.success.light} !important`,
      },
      lista: {
        marginTop: "10px",
      },
      counter: {
        marginTop: 15,
      },
    };
  };
};
