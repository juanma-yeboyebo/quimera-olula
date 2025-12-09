export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      container: {
        padding: 0,
      },
      counter: {
        marginTop: 15,
      },
    };
  };
};
