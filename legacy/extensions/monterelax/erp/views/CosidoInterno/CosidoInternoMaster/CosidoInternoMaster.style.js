export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      pendiente: {
        backgroundColor: "white",
        cursor: "pointer",
      },
      pausada: {
        backgroundColor: `${theme.palette.grey[500]}`,
        cursor: "pointer",
      },
      encurso: {
        backgroundColor: `${theme.palette.warning.light}`,
        cursor: "pointer",
      },
      container: {
        padding: 0,
      },
    };
  };
};
