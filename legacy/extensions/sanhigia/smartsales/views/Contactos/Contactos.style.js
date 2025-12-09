export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      mainBoxSubtitle: {
        fontSize: "1.2rem",
        textDecoration: "underline",
      },
      pedidosOtrosHeader: {
        "margin": "15px 0",
        "display": "flex",
        "backgroundColor": "#fff",
        "padding": "2px 10px",
        "boxShadow": "0 0 5px 2px #c1c1c1",
        "&:hover": {
          cursor: "pointer",
        },
      },
      listItemPedidosOtros: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        margin: "0px 5px",
      },
      listItemPedidosOtrosAux: {
        display: "block",
        fontSize: "1.3rem",
        fontWeight: "700",
        color: "red",
        backgroundColor: "#e1e1e1",
        aspectRatio: "1",
        width: "24px",
        borderRadius: "50%",
        textAlign: "center",
      },
    };
  };
};
