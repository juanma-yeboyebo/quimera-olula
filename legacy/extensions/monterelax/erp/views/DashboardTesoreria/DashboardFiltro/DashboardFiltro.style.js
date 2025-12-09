export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      appBar: {
        backgroundColor: theme.palette.grey[200],
        padding: theme.spacing(1, 1),
        border: "0px",
        boxShadow: "none",
      },
      cabeceraDesktop: {
        display: "flex",
        alignItems: "center",
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
      fecha: {
        maxWidth: 150,
        flexGrow: 0,
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
      },
      fechasMobile: {
        display: "flex",
        alignItems: "center",
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
      },
      select: {
        flexGrow: 1,
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
      },
      selectMobile: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
      iconoCabecera: {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
      },
      filtro: {
        flexGrow: 2,
        maxWidth: 600,
        display: "flex",
        alignItems: "center",
      },
      negro: {
        color: "black",
      },
    };
  };
};
