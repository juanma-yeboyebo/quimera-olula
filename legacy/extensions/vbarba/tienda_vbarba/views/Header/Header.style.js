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
        "marginTop": theme.spacing(2),
        "color": "#4E833B",
        "transition": "all .2s ease-in-out",
        "&:hover": {
          color: "#4E833B",
          transform: "scale(1.2)",
        },
      },
      drawer: {
        background: theme.custom.menu.main,
        height: "calc(100vh - 60px)",
        marginTop: "90px",
      },
      drawerMobile: {
        background: theme.custom.menu.main,
        height: "calc(100vh - 60px)",
        marginTop: "175px",
      },
      toolbarSmall: {
        background: "#333333",
        paddingLeft: "10px",
        height: 62,
        borderRadius: "10px 0px 0px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      toolbarLarge: {
        background: theme.custom.menu.light,
        height: 120,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
      },
      toolbarLargeMobile: {
        background: theme.custom.menu.light,
        height: 95,
      },
      toolbarSmallMobile: {
        height: 80,
      },
      arribasToolbar: {
        width: "1100px",
        height: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      },
      appBar: {
        background: theme.palette.primary.light,
        height: 120,
      },
      appBarMobile: {
        background: theme.palette.primary.light,
        height: 175,
      },
      toolbarButton: {
        "width": "120px",
        "background": "#333333",
        "height": 45,
        "color": theme.custom.menu.light,
        "fontFamily": "Quicksand, sans-serif",
        "fontSize": "18px",
        "fontWeight": 500,
        "textTransform": "capitalize",
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center",
        "borderRadius": "0px",
        "borderBottom": "5px solid #333333",
        "&:hover": {
          borderBottom: "5px solid #4E833B",
          borderRadius: "0px",
          cursor: "pointer",
        },
      },
      toolbarButtonTienda: {
        "boxSizing": "content-box",
        "width": "200px",
        "background": "#4E833B",
        "height": 45,
        "color": theme.custom.menu.light,
        "fontFamily": "Quicksand, sans-serif",
        "fontSize": "18px",
        "fontWeight": 500,
        "textTransform": "capitalize",
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center",
        "borderBottom": "5px solid #4E833B",
        "borderRadius": "0px 10px 10px 0px",
        "&:hover": {
          background: "#4E833B",
          borderBottom: "5px solid #4E833B",
          cursor: "pointer",
        },
      },
      toolbarButtonMobile: {
        color: "#333333",
        fontFamily: "Quicksand, sans-serif",
        fontSize: "18px",
        fontWeight: 500,
        textTransform: "capitalize",
        marginTop: "5px",
        marginBottom: "5px",
      },
      menuEnlacesMovil: {
        backgroundColor: theme.custom.menu.light,
        display: "flex",
        flexDirection: "column",
      },
      userDrawerEnlaces: {
        marginTop: 185,
        backgroundColor: theme.custom.menu.light,
      },
      userDrawer: {
        marginTop: "90px",
        marginRight: "5px",
        marginBottom: "initial",
        height: "initial",
        borderRadius: "5px",
        padding: "0px 5px",
      },
      userDrawerMobile: {
        marginTop: "175px",
        marginRight: "5px",
        marginBottom: "initial",
        height: "initial",
        borderRadius: "5px",
        padding: "0px 5px",
      },
      logoDesktop: {
        marginLeft: "20px",
        marginBottom: "10px",
      },
      logoMobile: {
        height: "80px",
        marginLeft: "0px",
      },
      userIcon: {
        "color": theme.custom.menu.light,
        "transition": "all .2s ease-in-out",
        "&:hover": {
          color: theme.custom.menu.light,
          transform: "scale(1.2)",
        },
      },
      hr: {
        height: "4px",
        width: "10%",
        background: "#4E833B",
        margin: "0px",
        // paddingLeft: "20%",
      },
    };
  };
};
