export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      centralBox: {
        display: "flex",
        justifyContent: "center",
      },
      innerBox: {
        width: "480px",
        height: "480px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      },
      titulo: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        height: "60px",
        backgroundColor: theme.palette.primary.main,
      },
      contenido: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "stretch",
        padding: "10%",
        textAlign: "center",
      },
      pie: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
      },
    };
  };
};
