export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      referencia: {
        color: "pink",
        fontSize: "10px"
      },
    };
  };
};
