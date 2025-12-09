export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      root: {
        display: "flex",
        justifyContent: "center",
        // alignItems: "space-between",
        height: "100vh",
      },
      gridItems: {
        padding: theme.spacing(2),
        textAlign: "center",
      },
      header: {
        flexBasis: "100px",
        maxHeight: "85px",
        margin: theme.spacing(2),
        background: "linear-gradient(60deg, #D95578, #f25e86)",
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
      loginButton: {
        "width": "140px",
        "color": "#D95578",
        "transition": "0.5s ease-out",
        "&:hover": {
          backgroundColor: "#D95578",
          color: "#fff",
        },
      },
      logo: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    };
  };
};
