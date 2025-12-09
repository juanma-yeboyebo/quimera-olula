export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      backIcon: {
        color: "white",
      },
      notaSinTela: {
        color: "red",
      },
    };
  };
};
