import core from "@quimera-extension/core";
import login from "@quimera-extension/login";

import AppMenu from "./static/appmenu";
import schemas from "./static/schemas";
import * as FacturaCli from "./views/FacturaCli";
import * as FacturasCli from "./views/FacturasCli";
import * as FacturasCliNueva from "./views/FacturasCliNueva";
import * as FacturaDirCliente from "./views/FacturasCli/DirCliente";
import * as FacturaDetalle from "./views/FacturasCli/FacturaDetalle";
import * as FacturasFiltro from "./views/FacturasCli/FacturasFiltro";
import * as FacturasMaster from "./views/FacturasCli/FacturasMaster";
import * as LineaFacturaCli from "./views/LineaFacturaCli";
import * as LineaFacturaCliNueva from "./views/LineaFacturaCliNueva";

export * from "./comps";

export default {
  path: "extensions/base/facturas",
  views: {
    LineaFacturaCli,
    LineaFacturaCliNueva,
    FacturaCli,
    FacturasCli,
    FacturasCliNueva
  },
  subviews: {
    "FacturasCli/DirCliente": FacturaDirCliente,
    "FacturasCli/FacturasMaster": FacturasMaster,
    "FacturasCli/FacturasFiltro": FacturasFiltro,
    "FacturasCli/FacturaDetalle": FacturaDetalle,
  },
  routes: {
    "/ventas/facturas": { type: "view", view: "FacturasCli" },
    "/ventas/facturas/:idFactura": { type: "view", view: "FacturasCli" },
  },
  dependencies: [core, login],
  schemas,
  menus: {
    app: AppMenu,
  },
};
