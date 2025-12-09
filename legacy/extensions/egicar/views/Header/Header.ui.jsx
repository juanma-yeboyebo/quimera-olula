import { AppBar, AppMenu, Drawer, HideOnScroll, Icon, Toolbar, Typography } from "@quimera/comps";
import Quimera, { A, useAppValue, useWidth } from "quimera";
import { useState } from "react";

function Header({ useStyles }) {
  const classes = useStyles();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);

  const [{ nombrePaginaActual, menus }] = useAppValue();

  const [appDrawerAbierto, setAppDrawerAbierto] = useState();
  const [userDrawerAbierto, setUserDrawerAbierto] = useState();

  const menuIcon = appDrawerAbierto ? "close" : "menu";
  const elevation = mobile && { elevation: 0 };

  const appBar = (
    <AppBar className={classes.appBar} {...elevation}>
      <Toolbar className={classes.toolbar} variant="dense">
        {!!Object.keys(menus?.app).length && (
          <Icon className={classes.menuIcon} onClick={() => setAppDrawerAbierto(true)}>
            {menuIcon}
          </Icon>
        )}

        <A href="/">
          <img
            alt="Project logo"
            src="/img/logo.png"
            height={"60px"}
            className={`${classes.logo} ${classes.whiteLogo}`}
          />
        </A>

        <Quimera.Block id="extraLogo" />

        <Typography noWrap className={classes.tituloPaginaActual}>
          {nombrePaginaActual}
        </Typography>

        <Quimera.Block id="extraAppBar" />

        {!!Object.keys(menus?.user).length && (
          <Icon
            className={classes.userIcon}
            fontSize="large"
            onClick={() => setUserDrawerAbierto(true)}
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
          <AppMenu
            structure={menus?.app}
            variant="side"
            closeCallback={() => setAppDrawerAbierto(false)}
          />
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
    </Quimera.Template>
  );
}

export default Header;
