import core from "@quimera-extension/core";

import AppMenu from "./static/appmenu";
import schemas from "./static/schemas";
import * as Compra from "./views/Compra";
import * as Compras from "./views/Compras";
import * as ComprasFiltro from "./views/Compras/ComprasFiltro";
import * as ComprasMaster from "./views/Compras/ComprasMaster";
import * as DatosConsumidor from "./views/DatosConsumidor";
import * as Header from "./views/Header";
import * as Home from "./views/Home";
// import * as Footer from "./views/Footer";
import * as Login from "./views/Login";
import * as Signup from "./views/Signup";

export default {
  path: "extensions/comalma",
  views: {
    Compra,
    Compras,
    Home,
    DatosConsumidor,
    Signup,
    Login,
    Header,
    // Footer,
  },
  subviews: {
    "Compras/ComprasMaster": ComprasMaster,
    "Compras/ComprasFiltro": ComprasFiltro,
  },
  routes: {
    "/": { type: "view", view: "Home" },
    "/compras": { type: "view", view: "Compras" },
    "/compras/:idCompra": { type: "view", view: "Compras" },
    "/usuario": { type: "view", view: "DatosConsumidor" },
    // "/signup": { type: "view", view: "Signup" },
  },
  menus: {
    app: AppMenu,
  },
  dependencies: [core],
  schemas,
};
