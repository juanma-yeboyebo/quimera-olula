export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      hPaper: {
        backgroundColor: theme.palette.primary.main,
        borderRadius: theme.shape.borderRadius,
        marginBottom: theme.spacing(1),
        boxSizing: "border-box",
      },
    };
  };
};
