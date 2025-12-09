export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      menuIcon: {
        "marginRight": theme.spacing(1),
        "marginLeft": theme.spacing(-1),
        "color": theme.palette.primary.light,
        "transition": "all .2s ease-in-out",
        "&:hover": {
          color: theme.palette.primary.light,
          transform: "scale(1.2)",
        },
      },
      drawer: {
        background: theme.palette.primary.main,
        height: "calc(100vh - 60px)",
        marginTop: "60px",
      },
      toolbar: {
        background: theme.palette.primary.dark,
        height: 60,
      },
      appBar: {
        background: theme.palette.primary.light,
        height: 60,
      },
      logo: {
        "transform": "scale(0.7)",
        "transition": "all .4s ease-in-out",
        "&:hover": {
          transform: "scale(0.85)",
        },
      },
      whiteLogo: {
        filter: "brightness(0) invert(1)",
      },
      tituloPaginaActual: {
        color: theme.palette.primary.light,
        fontSize: 24,
        fontWeight: 420,
        paddingLeft: 10,
        flexGrow: 1,
      },
      userDrawer: {
        marginTop: "65px",
        marginRight: "5px",
        marginBottom: "initial",
        height: "initial",
        borderRadius: "5px",
        padding: "0px 5px",
      },
      userIcon: {
        "transition": "all .2s ease-in-out",
        "&:hover": {
          color: theme.palette.primary.light,
          transform: "scale(1.2)",
        },
      },
    };
  };
};
