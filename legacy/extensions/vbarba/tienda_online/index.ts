import tiendaNativa from "@quimera-extension/base-tienda_nativa";
import areaClientes from "@quimera-extension/base-area_clientes";

import core from "@quimera-extension/core";

import UserMenu from "./static/usermenu";
import * as ItemCatalogo from "./comps/ItemCatalogo";
import * as ItemLineaCarritoCheckout from "./comps/ItemLineaCarritoCheckout";
import AppMenu from "./static/appmenu";
import schemas from "./static/schemas";
import { translations } from "./static/translations";
import * as Catalogo from "./views/Catalogo";
import * as CatalogoFiltro from "./views/Catalogo/CatalogoFiltro";
import * as CatalogoMaster from "./views/Catalogo/CatalogoMaster";
import * as Checkout from "./views/Checkout";
import * as CheckoutDatosCliente from "./views/Checkout/DatosCliente";
import * as CheckoutLineas from "./views/Checkout/Lineas";
import * as CondicionesVenta from "./views/CondicionesVenta";
import * as Login from "./views/Login";
// import * as MisPedidos from "./views/MisPedidos";
// import * as MisPedidosMaster from "./views/MisPedidos/MisPedidosMaster";
import * as MiPedidoWeb from "./views/MiPedidoWeb";
import * as MisPedidosWeb from "./views/MisPedidosWeb";
import * as MisPedidosWebMaster from "./views/MisPedidosWeb/MisPedidosWebMaster";
import * as Producto from "./views/Producto";
import * as ToCarrito from "./views/ToCarrito";
import * as ToCarritoNuevo from "./views/ToCarritoNuevo";
import * as ToCarritos from "./views/ToCarritos";
import * as ToCarritosMaster from "./views/ToCarritos/ToCarritosMaster";
import * as ToLineaCarrito from "./views/ToLineaCarrito";
import * as MiPedido from './views/MiPedido';
import * as MiAlbaran from './views/MiAlbaran';
import * as MiFactura from './views/MiFactura';

export * from "./comps";

export default {
  path: "extensions/vbarba/tienda-online",
  views: {
    Catalogo,
    Checkout,
    CondicionesVenta,
    Login,
    Producto,
    ToCarritos,
    MisPedidosWeb,
    ToLineaCarrito,
    ToCarrito,
    ToCarritoNuevo,
    // MisPedidos,
    MiPedido,
    MiFactura,
    MiPedidoWeb,
    MiAlbaran

  },
  subviews: {
    "Catalogo/CatalogoFiltro": CatalogoFiltro,
    "Catalogo/CatalogoMaster": CatalogoMaster,
    "Checkout/DatosCliente": CheckoutDatosCliente,
    "Checkout/Lineas": CheckoutLineas,
    ItemCatalogo,
    ItemLineaCarritoCheckout,
    ToCarritosMaster,
    MisPedidosWebMaster,
    // MisPedidosMaster,
  },
  routes: {
    "/": { type: "view", view: "Catalogo" },
    "/catalogo/referencia/:referenciaProp": { type: "view", view: "Catalogo" },
    "/producto/:referencia": { type: "view", view: "Producto" },
    "/carritos": { type: "view", view: "ToCarritos" },
    "/carritos/:idCarrito": { type: "view", view: "ToCarritos" },
    "/mispedidosweb": { type: "view", view: "MisPedidosWeb" },
    "/mispedidosweb/:idCarrito": { type: "view", view: "MisPedidosWeb" },
    "/login/:loginType": { type: "view", view: "Login" },
  },
  dependencies: [core, tiendaNativa, areaClientes],
  menus: {
    app: AppMenu,
    user: UserMenu,
  },
  schemas,
  translations,
};
