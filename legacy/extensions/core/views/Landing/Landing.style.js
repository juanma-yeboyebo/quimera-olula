export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      container: {
        margin: "auto",
      },
      logo: {
        width: "50%",
        height: "50%",
      },
    };
  };
};
