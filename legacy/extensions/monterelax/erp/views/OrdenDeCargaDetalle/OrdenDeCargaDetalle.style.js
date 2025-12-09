export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      barraProgreso: {
        marginBottom: theme.spacing(0.5),
      },
      barraProgresoCargadas: {
        backgroundColor: theme.palette.primary.light,
      },
      barraProgresoTotal: {
        backgroundColor: theme.palette.primary.main,
      },
      container: {
        padding: 0,
      },
      cargado: {
        color: theme.palette.common.ok,
      },
      red: {
        backgroundColor: "#DF5F46",
      },
      green: {
        backgroundColor: "#2ED33B",
      },
      searchBox: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
      },
      tituloBox: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
      },
      appBar: {
        backgroundColor: theme.palette.primary.dark,
        padding: theme.spacing(1, 1),
      },
      textField: {
        backgroundColor: theme.palette.primary.main,
        border: "none",
        borderRadius: 4,
        color: "white",
        padding: theme.spacing(0.5, 0, 0, 1),
      },
      alert: {
        backgroundColor: "#37E15E",
      },
    };
  };
};
