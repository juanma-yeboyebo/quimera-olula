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

import { SlidingBorder } from "../../comps";
import './Header.style.scss';

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
  const urlArribasCenter = "https://www.arribascenter.com";

  const enlaces = [
    { titulo: t("enlacesArribas.empresa.titulo"), url: t("enlacesArribas.empresa.url") },
    { titulo: t("enlacesArribas.catalogos.titulo"), url: t("enlacesArribas.catalogos.url") },
    { titulo: t("enlacesArribas.produccion.titulo"), url: t("enlacesArribas.produccion.url") },
    { titulo: t("enlacesArribas.blog.titulo"), url: t("enlacesArribas.blog.url") },
    { titulo: t("enlacesArribas.foro.titulo"), url: t("enlacesArribas.foro.url") },
    { titulo: t("enlacesArribas.localizacion.titulo"), url: t("enlacesArribas.localizacion.url") },
    { titulo: t("enlacesArribas.contacto.titulo"), url: t("enlacesArribas.contacto.url") },
  ];

  const trigger = useScrollTrigger();

  const estilos = {
    selectorIdioma: { botonIdiomaActual: mobile ? classes.userIcon : classes.menuIconGreen },
  };

  const appBar = (
    <AppBar className={mobile ? classes.appBarMobile : classes.appBar} {...elevation}>
      <Toolbar
        className={mobile ? classes.toolbarLargeMobile : classes.toolbarLarge}
        variant="dense"
      >
        {!mobile && !!Object.keys(menus?.app).length && (
          <Box height="100%" display={"flex"} alignItems={"center"}>
            <Icon className={classes.menuIconGreen} onClick={() => setAppDrawerAbierto(true)}>
              {menuIcon}
            </Icon>
          </Box>
        )}
        {mobile ? (
          <Box width={1} display={"flex"} alignItems={"center"} justifyContent={"center"}>
            {/* <Box width={1}>
              <Icon
                className={classes.menuIconGreen}
                onClick={() => setEnlacesDrawerAbierto(!enlacesDrawerAbierto)}
              >
                {menuIconEnlaces}
              </Icon>
            </Box> */}
            <Box width={1} />
            <Box width={1}>
              <A href="/">
                <img alt="Project logo" src="/img/logo.png" className={classes.logoMobile} />
              </A>

            </Box>
            <Box width={1} />
          </Box>
        ) : (
          <Box width={1} className={classes.arribasToolbar}>
            <Box className="HeaderIcons">
              <A href="/">
                <img
                  alt="Project logo"
                  src="/img/logo.png"
                  height={"60px"}
                  className={classes.logoDesktop}
                />
              </A>
              <Box className="HeaderIcons" alignItems={"center"}>
                <img src='/img/Under_construction.jpeg' className="IconoConstruccion" />
                <Typography variant="h5" className="UnderConstructionText">{"En construcción, en breve estará disponible."}</Typography>
              </Box>
            </Box>
            <Box width={1} className={classes.toolbarSmall}>
              <SlidingBorder enlaces={enlaces} urlBase={urlArribasCenter} />
              <Box>
                <Button px={1} className={classes.toolbarButtonTienda}>
                  {t("enlacesArribas.tiendaOnline")}
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {!mobile && (
          <Box height="100%" display={"flex"} alignItems={"center"}>
            <Typography noWrap className={classes.tituloPaginaActual}>
              {nombrePaginaActual}
            </Typography>

            <Quimera.Block id="extraAppBar" />

            <SelectorIdioma estilos={estilos["selectorIdioma"]} />

            {!guest && (
              <Box mr={3}>
                <Badge
                  invisible={carrito.lineas.length === 0}
                  color="secondary"
                  overlap="circle"
                  badgeContent={carrito.lineas.length}
                >
                  <Icon
                    className={classes.menuIconGreen}
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
                className={classes.menuIconGreen}
                fontSize="large"
                onClick={() => (guest ? navigate("/login/customer") : setUserDrawerAbierto(true))}
              >
                account_circle
              </Icon>
            )}
          </Box>
        )}
      </Toolbar>

      {mobile && (
        <Toolbar className={classes.toolbarSmallMobile} variant="string">
          {!!Object.keys(menus?.app).length && (
            <Icon className={classes.menuIcon} onClick={() => setAppDrawerAbierto(true)}>
              {menuIcon}
            </Icon>
          )}

          <Typography noWrap className={classes.tituloPaginaActual}>
            {nombrePaginaActual}
          </Typography>

          <Quimera.Block id="extraAppBar" />

          <SelectorIdioma estilos={estilos["selectorIdioma"]} />

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
      )}
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
              href={`${urlArribasCenter}${enlace.url}`}
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
