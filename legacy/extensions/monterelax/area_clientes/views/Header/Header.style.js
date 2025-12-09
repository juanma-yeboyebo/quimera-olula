export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      drawerMovil: {
        width: "80%",
      },
      appBar: {
        background: "#222",
        height: 60,
      },
    };
  };
};
