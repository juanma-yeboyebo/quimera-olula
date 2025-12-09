export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      deleteCancelButton: {
        color: `${theme.palette.primary.main}`,
      },
      deleteText: {
        color: `${theme.palette.error.main}`,
      },
    };
  };
};
