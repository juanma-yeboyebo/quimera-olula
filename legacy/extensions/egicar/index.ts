import albaranes from "@quimera-extension/base-albaranes";
import core from "@quimera-extension/core";
import firmasAlbaranes from "@quimera-extension/base-firma_albaranes"

import AppMenu from "./static/appmenu";
import schemas from "./static/schemas";
import * as FirmaAlbaran from "./views/FirmaAlbaran";
import * as Header from "./views/Header";
import * as OrdenesProd from "./views/OrdenesProd";
import * as OrdenesProdMaster from "./views/OrdenesProd/OrdenesProdMaster";
import * as OrdenProd from "./views/OrdenProd";
import * as Pedido from "./views/Pedido";
import * as Pedidos from "./views/Pedidos";
import * as PedidosMaster from "./views/Pedidos/PedidosMaster";
import * as TareasTerminal from "./views/TareasTerminal";
import * as Tarea from "./views/TareasTerminal/Tarea";

export default {
  path: "extensions/egicar",
  views: {
    Header,
    OrdenProd,
    OrdenesProd,
    TareasTerminal,
    Pedidos,
    Pedido,
    FirmaAlbaran,
  },
  subviews: {
    "TareasTerminal/Tarea": Tarea,
    "OrdenesProd/OrdenesProdMaster": OrdenesProdMaster,
    "Pedidos/PedidosMaster": PedidosMaster,
  },
  routes: {
    "/": { type: "view", view: "TareasTerminal" },
    "/tareas/tareasterminal": { type: "view", view: "TareasTerminal" },
    "/tareas/tareasterminal/:idTareaProp": { type: "view", view: "TareasTerminal" },
    "/ordenesprod": { type: "view", view: "OrdenesProd" },
    "/ordenesprod/:codOrdenProp": { type: "view", view: "OrdenesProd" },
    "/tareas/tareasterminal/:idTareaProp/ordenesprod/:codOrdenProp": {
      type: "view",
      view: "OrdenesProd",
    },
    "/pedidos": { type: "view", view: "Pedidos" },
    "/pedidos/:idPedido": { type: "view", view: "Pedidos" },
    "/ordenesprod/pedido/:codigoOrdenProp/:idPedido": { type: "view", view: "Pedidos" },
    "/tareas/tareasterminal/:idTareaProp/pedido/:codigoOrdenProp/:idPedido": {
      type: "view",
      view: "Pedidos",
    },
    // "/albaranesVenta": { type: "view", view: "AlbaranesVenta" },
  },
  dependencies: [core, albaranes, firmasAlbaranes],
  menus: {
    app: AppMenu,
  },
  schemas,
};
