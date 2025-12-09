import core from "@quimera-extension/core";

import AppMenu from "./static/appmenu";
import schemas from "./static/schemas";
import * as DatosComercio from "./views/DatosComercio";
import * as Header from "./views/Header";
import * as Home from "./views/Home";
import * as Login from "./views/Login";
import * as Venta from "./views/Venta";
import * as VentaNueva from "./views/VentaNueva";
import * as Ventas from "./views/Ventas";
import * as VentasMaster from "./views/Ventas/VentasMaster";
// import * as Footer from "./views/Footer";

export default {
  path: "extensions/comalma",
  views: {
    Venta,
    Ventas,
    VentaNueva,
    DatosComercio,
    Home,
    Login,
    Header,
    // Footer,
  },
  subviews: {
    "Ventas/VentasMaster": VentasMaster,
  },
  routes: {
    "/": { type: "view", view: "Ventas" },
    "/ventas": { type: "view", view: "Ventas" },
    "/ventas/:idVenta": { type: "view", view: "Ventas" },
    "/nuevaventa": { type: "view", view: "VentaNueva" },
    "/comercio": { type: "view", view: "DatosComercio" },
  },
  menus: {
    app: AppMenu,
  },
  dependencies: [core],
  schemas,
};
