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
      yellow: {
        backgroundColor: "#E59D0E !important",
      },
      green: {
        backgroundColor: "#2ED33B !important",
      },
    };
  };
};
