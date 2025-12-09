export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      leftIcon: {
        marginRight: theme.spacing(1),
      },
      field: {
        width: "100px",
      },
    };
  };
};
