export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      cajaStock: {
        marginTop: theme.spacing(2),
      },
      paper20Auto: { minWidth: "20%" },
    };
  };
};
