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
    };
  };
};
