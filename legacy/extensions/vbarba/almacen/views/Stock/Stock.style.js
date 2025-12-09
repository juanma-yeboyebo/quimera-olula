export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      referencia: {
        flexGrow: 1,
        marginRight: theme.spacing(1),
      },
      cajaStock: {
        marginTop: theme.spacing(2),
      },
      paper20Auto: { minWidth: "20%" },
    };
  };
};
