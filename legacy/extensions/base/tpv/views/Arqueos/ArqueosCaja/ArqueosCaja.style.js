export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      field: {
        width: "50px",
      },
    };
  };
};
