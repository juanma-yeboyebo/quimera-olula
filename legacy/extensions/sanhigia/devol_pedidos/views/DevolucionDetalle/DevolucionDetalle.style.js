export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
      },
      container: {
        minHeight: "500px",
        padding: "25px",
      },
      cabeceraPedido: {
        position: "sticky",
        top: "0px",
        backgroundColor: "white",
        zIndex: "1100",
      },
      cabeceraPedidoTitulo: {
        borderBottom: "1px solid black",
        fontSize: "1.5em",
        fontWeight: 700,
        display: "flex",
      },
      codigoPedido: {
        justifySelf: "flex-start",
      },
      gridConfirmar: {
        padding: "25px 0px",
        display: "flex",
        gap: "2em",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "center",
      },
      lineaPedidoMovil: {
        width: "100%",
        overflow: "hidden",
        marginLeft: "6px" /* , whiteSpace: 'nowrap', textOverflow: 'ellipsis' */,
      },
      numberColumnEditable: {
        marginLeft: "20px",
      },
      listItem: {
        "display": "flex",
        "alignItems": "center",
        "gap": "1em",
        "paddingLeft": "5px",
        "fontSize": "15px",
        "&:nth-child(odd)": {
          backgroundColor: "#eee",
        },
      },
      avatarCantidad: {
        flexBasis: "50px",
        minWidth: "50px",
        height: "50px",
        display: "flex",
        backgroundColor: theme.palette.success.light,
        borderRadius: "50%",
        justifyContent: "center",
        alignItems: "center",
      },
      avatarEmpty: {
        flexBasis: "50px",
        minWidth: "50px",
        height: "50px",
        display: "flex",
        backgroundColor: "transparent",
        borderRadius: "50%",
        justifyContent: "center",
        alignItems: "center",
      },
      lineaDevolItem: {
        "display": "flex",
        "flexDirection": "column",
        "alignItems": "stretch",
        "gap": "0.5em",
        "whiteSpace": "nowrap",
        "overflow": "hidden",
        "& > section": {
          display: "flex",
          flexWrap: "wrap",
          gap: "1em",
          alignItems: "center",
        },
      },
      descripcion: {
        flexGrow: "999",
        minWidth: "60%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    };
  };
};
