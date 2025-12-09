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
      red: {
        backgroundColor: "red",
      },
      yellow: {
        backgroundColor: "#E59D0E",
      },
      green: {
        backgroundColor: "#2ED33B",
      },
      counter: {
        marginTop: 15,
      },
    };
  };
};
