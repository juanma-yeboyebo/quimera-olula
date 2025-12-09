export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      menuIcon: {
        "marginRight": theme.spacing(1),
        "marginLeft": theme.spacing(-1),
        "color": theme.custom.menu.light,
        "transition": "all .2s ease-in-out",
        "&:hover": {
          color: theme.custom.menu.light,
          transform: "scale(1.2)",
        },
      },
      menuIconGreen: {
        "marginRight": theme.spacing(1),
        "marginLeft": theme.spacing(-1),
        "color": "#4A7D3F",
        "transition": "all .2s ease-in-out",
        "&:hover": {
          color: "#4A7D3F",
          transform: "scale(1.2)",
        },
      },
      drawerEnlaces: {
        background: theme.palette.primary.dark,
        height: "calc(100vh - 60px)",
        marginTop: "60px",
      },
      drawer: {
        background: theme.custom.menu.main,
        height: "calc(100vh - 60px)",
        marginTop: "45px",
      },
      drawerMobile: {
        background: theme.custom.menu.main,
        height: "calc(100vh - 60px)",
        marginTop: "70px",
      },
      toolbarSmall: {
        background: "#353839",
        height: 45,
      },
      toolbarSmallMobile: {
        background: "#353839",
        height: 70,
      },
      toolbarLarge: {
        background: theme.custom.menu.light,
        height: 170,
      },
      toolbarLargeMobile: {
        background: theme.custom.menu.light,
        height: 115,
      },
      appBar: {
        background: theme.palette.primary.light,
        height: 215,
      },
      appBarMobile: {
        background: theme.palette.primary.light,
        height: 185,
      },
      toolbarButton: {
        "color": "#353839",
        "fontFamily": "Poppins, sans-serif",
        "fontSize": "18px",
        "fontWeight": 500,
        "textTransform": "uppercase",
        "&:hover": {
          color: "#4A7D3F",
          backgroundColor: theme.custom.menu.light,
        },
      },
      toolbarButtonMobile: {
        color: "#353839",
        fontFamily: "Poppins, sans-serif",
        fontSize: "18px",
        fontWeight: 500,
        textTransform: "uppercase",
        marginTop: "5px",
        marginBottom: "5px",
      },
      toolbarSmallButtonText: {
        color: theme.custom.menu.light,
        fontFamily: "Poppins, sans-serif",
        fontSize: "13px",
        letterSpacing: "0.4px",
      },
      toolbarSmallButtonIcon: {
        color: "#4A7D3F",
        paddingRight: "10px",
      },
      toolbarLargeButtonIcon: {
        color: theme.custom.menu.light,
        // paddingRight: "10px",
      },
      menuEnlacesMovil: {
        // marginTop: 185,
        backgroundColor: theme.custom.menu.light,
        display: "flex",
        flexDirection: "column",
      },
      userDrawerEnlaces: {
        marginTop: 185,
        backgroundColor: theme.custom.menu.light,
      },
      userDrawer: {
        marginTop: "45px",
        marginRight: "5px",
        marginBottom: "initial",
        height: "initial",
        borderRadius: "5px",
        padding: "0px 5px",
      },
      userDrawerMobile: {
        marginTop: "70px",
        marginRight: "5px",
        marginBottom: "initial",
        height: "initial",
        borderRadius: "5px",
        padding: "0px 5px",
      },
      logoDesktop: {
        transform: "scale(0.65)",
        marginLeft: "20px",
      },
      logoMobile: {
        // transform: "scale(0.65)",
        height: "90px",
        marginLeft: "0px",
        // border: "1px solid red",
      },
      // whiteLogo: {
      //   filter: 'brightness(0) invert(1)',
      // },
      // tituloPaginaActual: {
      //   color: theme.custom.menu.light,
      //   fontSize: 24,
      //   fontWeight: 420,
      //   paddingLeft: 10,
      //   flexGrow: 1,
      // },
      // userIcon: {
      //   transition: 'all .2s ease-in-out',
      //   '&:hover': {
      //     color: theme.custom.menu.light,
      //     transform: 'scale(1.2)',
      //   },
      // },
    };
  };
};
