import core from "@quimera-extension/core";

import AppMenu from "./static/appmenu";
import * as Arqueos from "./views/Arqueos";
import * as ArqueosCaja from "./views/Arqueos/ArqueosCaja";
import * as ArqueosDetalle from "./views/Arqueos/ArqueosDetalle";
import * as ArqueosMaster from "./views/Arqueos/ArqueosMaster";
import * as ArqueosPagos from "./views/Arqueos/ArqueosPagos";
import * as Container from "./views/Container";
import * as Header from "./views/Header";
import * as Home from "./views/Home";
import * as Login from "./views/Login";
import * as LoginSeleccionPV from "./views/Login/SeleccionPV";
import * as TPV from "./views/TPV";
import * as VentasDetalleTPV from "./views/TPV/VentasDetalle";
import * as VentasLineasTPV from "./views/TPV/VentasLineas";
import * as VentasMasterTPV from "./views/TPV/VentasMaster";
import * as VentasNuevaLineaTPV from "./views/TPV/VentasNuevaLinea";
import * as VentasPagosTPV from "./views/TPV/VentasPagos";

export * from "./comps";
export * from "./lib";

export default {
  path: "extensions/base/tpv",
  views: {
    Container,
    Header,
    Home,
    TPV,
    Arqueos,
    Login,
  },
  subviews: {
    "TPV/VentasMaster": VentasMasterTPV,
    "TPV/VentasDetalle": VentasDetalleTPV,
    "TPV/VentasLineas": VentasLineasTPV,
    "TPV/VentasNuevaLinea": VentasNuevaLineaTPV,
    "TPV/VentasPagos": VentasPagosTPV,
    "Arqueos/ArqueosMaster": ArqueosMaster,
    "Arqueos/ArqueosDetalle": ArqueosDetalle,
    "Arqueos/ArqueosCaja": ArqueosCaja,
    "Arqueos/ArqueosPagos": ArqueosPagos,
    "Login/SeleccionPV": LoginSeleccionPV,
  },
  routes: {
    "/": { type: "view", view: "Home" },
    "/tpv": { type: "view", view: "TPV" },
    "/tpv/:idVenta": { type: "view", view: "TPV" },
    "/arqueos": { type: "view", view: "Arqueos" },
    "/arqueos/:idArqueo": { type: "view", view: "Arqueos" },
  },
  dependencies: [core],
  menus: {
    app: AppMenu,
  },
};
