import {
  AppBar,
  AppMenu,
  Badge,
  Box,
  Drawer,
  HideOnScroll,
  Icon,
  Toolbar,
  Typography,
} from "@quimera/comps";
import Quimera, { A, navigate, useAppValue, useWidth, util } from "quimera";
import { useState } from "react";

// import { SelectorIdioma } from "../../comps";

function Header({ useStyles }) {
  const classes = useStyles();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);

  const [{ carrito, nombrePaginaActual, menus, objetoConfirm }] = useAppValue();

  const [appDrawerAbierto, setAppDrawerAbierto] = useState();
  const [userDrawerAbierto, setUserDrawerAbierto] = useState();
  const [carritoDrawerAbierto, setCarritoDrawerAbierto] = useState();

  const menuIcon = appDrawerAbierto ? "close" : "menu";
  const elevation = mobile && { elevation: 0 };

  const guest = util.getUser().user === "guest";

  const appBar = (
    <AppBar className={classes.appBar} {...elevation}>
      <Toolbar className={classes.toolbar} variant="dense">
        {!!Object.keys(menus?.app).length && (
          <Icon className={classes.menuIcon} onClick={() => setAppDrawerAbierto(true)}>
            {menuIcon}
          </Icon>
        )}

        <A href="/">
          <img alt="Project logo" src="/img/logo.png" className={classes.logo} />
        </A>

        <Quimera.Block id="extraLogo" />

        <Typography noWrap className={classes.tituloPaginaActual}>
          {nombrePaginaActual}
        </Typography>

        <Quimera.Block id="extraAppBar" />

        {/* <SelectorIdioma /> */}

        {!guest && (
          <Box mr={3}>
            <Badge
              invisible={carrito.lineas.length === 0}
              color="secondary"
              overlap="circle"
              badgeContent={carrito.lineas.length}
            >
              <Icon
                className={classes.userIcon}
                fontSize="large"
                onClick={() =>
                  carrito.lineas.length > 0 && setCarritoDrawerAbierto(!carritoDrawerAbierto)
                }
              >
                shopping_cart
              </Icon>
            </Badge>
          </Box>
        )}

        {!!Object.keys(menus?.user).length && (
          <Icon
            className={classes.userIcon}
            fontSize="large"
            onClick={() => (guest ? navigate("/login/customer") : setUserDrawerAbierto(true))}
          >
            account_circle
          </Icon>
        )}
      </Toolbar>
    </AppBar>
  );

  return (
    <Quimera.Template id="Header">
      {mobile ? <HideOnScroll>{appBar}</HideOnScroll> : appBar}

      {!!Object.keys(menus?.app).length && (
        <Drawer
          anchor="left"
          open={appDrawerAbierto}
          onClose={() => setAppDrawerAbierto(false)}
          classes={{ paper: `${classes.drawer} ${classes.appDrawer}` }}
          transitionDuration={{ enter: 500, exit: 500 }}
        >
          <AppMenu structure={menus?.app} variant="side" />
        </Drawer>
      )}

      {!!Object.keys(menus?.user).length && (
        <Drawer
          anchor="right"
          open={userDrawerAbierto}
          onClose={() => setUserDrawerAbierto(false)}
          classes={{ paper: `${classes.drawer} ${classes.userDrawer}` }}
          transitionDuration={{ enter: 500, exit: 500 }}
        >
          <AppMenu structure={menus?.user} variant="side" />
        </Drawer>
      )}

      <Drawer
        anchor="right"
        open={carritoDrawerAbierto}
        onClose={() => setCarritoDrawerAbierto(false)}
        classes={{ paper: mobile ? `${classes.drawerMovil}` : null }}
        transitionDuration={{ enter: 500, exit: 500 }}
      >
        <Quimera.SubView
          id="Header/Carrito"
          onGoingToCheckout={() => setCarritoDrawerAbierto(false)}
        />
      </Drawer>
    </Quimera.Template>
  );
}

export default Header;
