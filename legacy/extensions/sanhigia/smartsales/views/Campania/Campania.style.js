export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      cajaQSectionEstatico: {
        gap: "0.5rem",
        // color: "#3b444b",
      },
    };
  };
};
