export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      },
      gridItems: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        textAlign: "center",
      },
      header: {
        flexBasis: "100px",
        maxHeight: "85px",
        margin: theme.spacing(2),
        background: "linear-gradient(60deg, #ab47bc, #8e24aa)",
        marginTop: "-40px",
        color: "#FFF",
        boxShadow:
          "0 12px 20px -10px rgba(156, 39, 176, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(156, 39, 176, 0.2)",
        borderRadius: "5px",
        padding: "25px",
      },
      typography: {
        fontWeight: "700",
      },
      nuevaEmpresaButton: {
        "width": "140px",
        "color": "#9c27b0",
        "transition": "0.5s ease-out",
        "&:hover": {
          backgroundColor: "#9c27b0",
          color: "#fff",
        },
      },
    };
  };
};
