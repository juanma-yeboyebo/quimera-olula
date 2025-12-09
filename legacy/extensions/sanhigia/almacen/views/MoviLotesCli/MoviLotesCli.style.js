export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      referencia: {
        flexGrow: 1,
        marginRight: theme.spacing(1),
      },
      ubicacionBox: {
        marginTop: "15px",
      },
      container: {
        minHeight: "500px",
        maxWidth: "100%",
        paddingTop: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: theme.spacing(2),
      },
      loteTitle: {
        padding: "10px 0px 10px 0px",
      },
      lotesTable: {
        marginLeft: theme.spacing(0),
        overflow: "auto",
        width: "100%"
      },
    };
  };
};
