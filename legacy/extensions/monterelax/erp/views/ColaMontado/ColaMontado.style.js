export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      element: {
        backgroundColor: "white",
      },
      container: {
        padding: 0,
      },
    };
  };
};
