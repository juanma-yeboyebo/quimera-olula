import { SelectorIdioma } from "@quimera-extension/base-tienda_nativa";
import {
  AppBar,
  AppMenu,
  Badge,
  Box,
  Button,
  Drawer,
  HideOnScroll,
  Icon,
  Toolbar,
  Typography,
} from "@quimera/comps";
import { useScrollTrigger, useTranslation } from "@quimera/thirdparty";
import Quimera, { A, navigate, useAppValue, useWidth, util } from "quimera";
import { useState } from "react";

function Header({ useStyles }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);

  const [{ carrito, nombrePaginaActual, menus, objetoConfirm }] = useAppValue();

  const [appDrawerAbierto, setAppDrawerAbierto] = useState();
  const [userDrawerAbierto, setUserDrawerAbierto] = useState();
  const [carritoDrawerAbierto, setCarritoDrawerAbierto] = useState();
  const [enlacesDrawerAbierto, setEnlacesDrawerAbierto] = useState(false);

  const menuIcon = appDrawerAbierto ? "close" : "menu";
  const menuIconEnlaces = enlacesDrawerAbierto ? "close" : "menu";
  const elevation = mobile && { elevation: 0 };

  const guest = util.getUser().user === "guest";
  const urlBarnaplant = "https://barnaplant.es";

  const enlaces = [
    { titulo: t("enlacesBarnaplant.nosotros.titulo"), url: t("enlacesBarnaplant.nosotros.url") },
    {
      titulo: t("enlacesBarnaplant.produccion.titulo"),
      url: t("enlacesBarnaplant.produccion.url"),
    },
    { titulo: t("enlacesBarnaplant.obras.titulo"), url: t("enlacesBarnaplant.obras.url") },
    { titulo: t("enlacesBarnaplant.catalogos.titulo"), url: t("enlacesBarnaplant.catalogos.url") },
    { titulo: t("enlacesBarnaplant.contacto.titulo"), url: t("enlacesBarnaplant.contacto.url") },
  ];

  const trigger = useScrollTrigger();

  const appBar = (
    <AppBar className={mobile ? classes.appBarMobile : classes.appBar} {...elevation}>
      <Toolbar
        className={mobile ? classes.toolbarSmallMobile : classes.toolbarSmall}
        variant="string"
      >
        {!!Object.keys(menus?.app).length && (
          <Icon className={classes.menuIcon} onClick={() => setAppDrawerAbierto(true)}>
            {menuIcon}
          </Icon>
        )}

        {!mobile && (
          <Box display={"flex"} ml={11}>
            {" "}
            <a href="tel:+34937541100" style={{ textDecoration: "none" }}>
              <Box display={"flex"}>
                <Icon fontSize="small" className={classes.toolbarSmallButtonIcon}>
                  phone_enabled
                </Icon>
                <Typography noWrap className={classes.toolbarSmallButtonText}>
                  +34 93 754 11 00
                </Typography>
              </Box>
            </a>
            <a href="mailto:bnp@barnaplant.com" style={{ textDecoration: "none" }}>
              <Box display={"flex"} ml={4}>
                <Icon fontSize="small" className={classes.toolbarSmallButtonIcon}>
                  mail_outline
                </Icon>
                <Typography noWrap className={classes.toolbarSmallButtonText}>
                  bnp@barnaplant.com
                </Typography>
              </Box>
            </a>
          </Box>
        )}

        <Typography noWrap className={classes.tituloPaginaActual}>
          {nombrePaginaActual}
        </Typography>

        <Quimera.Block id="extraAppBar" />

        <SelectorIdioma />

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
                onClick={() => setCarritoDrawerAbierto(!carritoDrawerAbierto)}
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

      <Toolbar
        className={mobile ? classes.toolbarLargeMobile : classes.toolbarLarge}
        variant="dense"
      >
        {mobile ? (
          <Box width={1} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
            <A href="/">
              <img alt="Project logo" src="/img/logo.png" className={classes.logoMobile} />
            </A>
            <Icon
              className={classes.menuIconGreen}
              onClick={() => setEnlacesDrawerAbierto(!enlacesDrawerAbierto)}
            >
              {menuIconEnlaces}
            </Icon>
          </Box>
        ) : (
          <Box width={1} display={"flex"} alignItems={"center"}>
            <A href="/">
              <img alt="Project logo" src="/img/logo.png" className={classes.logoDesktop} />
            </A>
            {enlaces.map(enlace => (
              <Box mx={1}>
                <Button
                  variant="text"
                  className={classes.toolbarButton}
                  href={`${urlBarnaplant}${enlace.url}`}
                >
                  {enlace.titulo}
                </Button>
              </Box>
            ))}
          </Box>
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
          classes={{
            paper: `${mobile ? classes.drawerMobile : classes.drawer} ${mobile ? classes.appDrawerMobile : classes.appDrawer
              }`,
          }}
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
          classes={{
            paper: `${mobile ? classes.drawerMobile : classes.drawer} ${mobile ? classes.userDrawerMobile : classes.userDrawer
              }`,
          }}
          // classes={{ paper: `${classes.drawer} ${classes.userDrawer}` }}
          transitionDuration={{ enter: 500, exit: 500 }}
        >
          <AppMenu structure={menus?.user} variant="side" />
        </Drawer>
      )}

      <Drawer
        anchor="right"
        open={carritoDrawerAbierto}
        onClose={() => setCarritoDrawerAbierto(false)}
        // classes={{ paper: `${classes.drawer} ${classes.userDrawer}` }}
        transitionDuration={{ enter: 500, exit: 500 }}
      >
        <Quimera.SubView
          id="Header/Carrito"
          onGoingToCheckout={() => setCarritoDrawerAbierto(false)}
        />
      </Drawer>

      <Drawer
        anchor="top"
        variant="persistent"
        open={enlacesDrawerAbierto && !trigger}
        onClose={() => setEnlacesDrawerAbierto(false)}
        classes={{ paper: classes.userDrawerEnlaces }}
        transitionDuration={{ enter: 500, exit: !trigger ? 500 : 200 }}
      >
        {enlaces.map(enlace => (
          <Box className={classes.menuEnlacesMovil}>
            <Button
              variant="text"
              className={classes.toolbarButtonMobile}
              href={`${urlBarnaplant}${enlace.url}`}
            >
              {enlace.titulo}
            </Button>
          </Box>
        ))}
      </Drawer>
    </Quimera.Template>
  );
}

export default Header;
