export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
      },
      // container: {
      //   flexGrow: 1,
      //   minHeight: 500,
      //   paddingLeft: theme.spacing(7) + 1
      // }
      cabeceraFirma: {
        position: "sticky",
        top: "0px",
        backgroundColor: "white",
        zIndex: "1100",
      },
      cabeceraFirmaTitulo: {
        borderBottom: "1px solid black",
        fontSize: "1.2em",
        fontWeight: "600",
        textAlign: "center",
        // paddingLeft: spacing(1),
        // paddingRight: spacing(1)
      },
      botonPrimarioText: theme.botonPrimarioText,
      sigPad: {
        width: "100%",
        height: "200px",
        border: "1px solid darkgray",
      },
    };
  };
};
