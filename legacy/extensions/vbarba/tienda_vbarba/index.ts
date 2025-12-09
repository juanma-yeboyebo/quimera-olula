import core from "@quimera-extension/core";
import tiendaOnline from "@quimera-extension/vbarba-tienda_online";

import AppMenu from "./static/appmenu";
import schemas from "./static/schemas";
import * as HeaderContainer from "./views/Container/HeaderContainer";
import * as Header from "./views/Header";
import * as HeaderCarrito from "./views/Header/Carrito";

export default {
  path: "extensions/tienda_vbarba",
  views: {
    Header,
  },
  subviews: {
    "Header/Carrito": HeaderCarrito,
    HeaderContainer,
  },
  routes: {},
  dependencies: [core, tiendaOnline],
  menus: {
    app: AppMenu,
  },
  schemas,
};
