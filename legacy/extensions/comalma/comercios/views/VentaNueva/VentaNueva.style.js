export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      hPaper: {
        backgroundColor: theme.palette.primary.main,
        borderRadius: theme.shape.borderRadius,
        marginBottom: theme.spacing(1),
        boxSizing: "border-box",
      },
      cajaBotonesCliente: {
        display: "flex",
        justifyContent: "center",
        gap: theme.spacing(1),
      },
      botonSeleccionado: {
        "borderRadius": "10px",
        "color": "white",
        "backgroundColor": theme.palette.primary.main,
        "&:hover": {
          backgroundColor: theme.palette.primary.light,
          color: "white",
          boxShadow: "none",
        },
      },
      botonNoSeleccionado: {
        color: theme.palette.primary.main,
      },
    };
  };
};
