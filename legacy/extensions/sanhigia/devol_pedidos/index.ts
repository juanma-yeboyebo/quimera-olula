import ventas from "@quimera-extension/base-ventas";
import core from "@quimera-extension/core";
import login from "@quimera-extension/login";
import almacen from "@quimera-extension/sanhigia-almacen";

import AppMenu from "./static/appmenu";
import schemas from "./static/schemas";
import * as DevolucionDetalle from "./views/DevolucionDetalle";
import * as DevolucionesPedidos from "./views/DevolucionesPedidos";
import * as BuscarFactura from "./views/DevolucionesPedidos/BuscarFactura";
import * as Footer from "./views/Footer";
import * as Home from "./views/Home";
import * as InformeClientesComparativa from "./views/InformeClientesComparativa";
import * as ComparativaArticulos from "./views/InformeClientesComparativa/ComparativaArticulos";
import * as ComparativaClientes from "./views/InformeClientesComparativa/ComparativaClientes";
import * as InformeClientesInactivos from "./views/InformeClientesInactivos";
import * as InformeClientesNuevos from "./views/InformeClientesNuevos";
import * as InformeClientesVentaArt from "./views/InformeClientesVentaArt";
import * as InformeConsumoCliente from "./views/InformeConsumoCliente";
import * as InformeContactosAgente from "./views/InformeContactosAgente";
import * as InformeMapa from "./views/InformeMapa";
import * as InformePedidosSan from "./views/InformePedidosSan";
import * as InformePedidosXAgente from "./views/InformePedidosXAgente";
import * as InformeRepeticiones from "./views/InformeRepeticiones";
import * as InformeRepeticionesFiltro from "./views/InformeRepeticiones/InformeRepeticionesFiltro";
import * as InformeTratosAgente from "./views/InformeTratosAgente";
import * as InformeVentasArticulo from "./views/InformeVentasArticulo";
import * as InformeVentasFamilia from "./views/InformeVentasFamilia";
import * as InformeVentasPoblacion from "./views/InformeVentasPoblacion";
import * as LineaPedidoCli from "./views/LineaPedidoCli";
import * as LineaPedidoCliNueva from "./views/LineaPedidoCliNueva";
import * as LineaPresupuestoCli from "./views/LineaPresupuestoCli";
import * as LineaPresupuestoCliNueva from "./views/LineaPresupuestoCliNueva";
import * as Login from "./views/Login";
import * as PedidoCli from "./views/PedidoCli";
import * as PedidoDirCliente from "./views/PedidosCli/DirCliente";
import * as PedidosMaster from "./views/PedidosCli/PedidosMaster";
import * as PedidosCliNuevo from "./views/PedidosCliNuevo";
import * as PresupuestoCli from "./views/PresupuestoCli";
import * as PresupuestoCliNuevo from "./views/PresupuestoCliNuevo";
import * as Master from "./views/PresupuestosCli/Master";
import * as PrevisionCompras from "./views/PrevisionCompras";
import * as AvisoStock from "./views/subviews/AvisoStock";
import * as AvisoSustitutivo from "./views/subviews/AvisoSustitutivo";
import * as PresupuestosCliNuevoNoRegistrado from "./views/subviews/PresupuestosCliNuevoNoRegistrado";
import * as PresupuestosCliNuevoRegistrado from "./views/subviews/PresupuestosCliNuevoRegistrado";

export * from "./comps";

export default {
  path: "extensions/sanhigia/devol-pedidos",
  views: {
    Home,
    Footer,
    DevolucionesPedidos,
    DevolucionDetalle,
    InformeRepeticiones,
    InformePedidosXAgente,
    InformePedidosSan,
    InformeClientesVentaArt,
    InformeClientesInactivos,
    InformeClientesComparativa,
    InformeClientesNuevos,
    InformeConsumoCliente,
    InformeVentasArticulo,
    InformeVentasFamilia,
    InformeVentasPoblacion,
    InformeContactosAgente,
    InformeTratosAgente,
    InformeMapa,
    Login,
    PedidoCli,
    PedidosCliNuevo,
    PresupuestoCli,
    PresupuestoCliNuevo,
    PrevisionCompras,
    LineaPedidoCliNueva,
    LineaPedidoCli,
    LineaPresupuestoCliNueva,
    LineaPresupuestoCli,
  },
  subviews: {
    "DevolucionesPedidos/BuscarFactura": BuscarFactura,
    "InformeRepeticiones/InformeRepeticionesFiltro": InformeRepeticionesFiltro,
    "subviewsSanhigia/AvisoSustitutivo": AvisoSustitutivo,
    "subviewsSanhigia/AvisoStock": AvisoStock,
    "PedidosCli/PedidosMaster": PedidosMaster,
    "PresupuestosCliNuevo/PresupuestosCliNuevoRegistrado": PresupuestosCliNuevoRegistrado,
    "PresupuestosCliNuevo/PresupuestosCliNuevoNoRegistrado": PresupuestosCliNuevoNoRegistrado,
    "InformeClientesComparativa/ComparativaClientes": ComparativaClientes,
    "InformeClientesComparativa/ComparativaArticulos": ComparativaArticulos,
    "PedidosCli/DirCliente": PedidoDirCliente,
    "PresupuestosCli/Master": Master,
  },
  routes: {
    "/": { type: "view", view: "Home" },
    "/DevolucionesPedidos": { type: "view", view: "DevolucionesPedidos" },
    "/InformeRepeticiones": { type: "view", view: "InformeRepeticiones" },
    "/InformePedidosXAgente": { type: "view", view: "InformePedidosXAgente" },
    "/informe-ventas-pedidos": { type: "view", view: "InformePedidosSan" },
    "/informe-clientes-venta-art": {
      type: "view",
      view: "InformeClientesVentaArt",
    },
    "/informe-clientes-inactivos": {
      type: "view",
      view: "InformeClientesInactivos",
    },
    "/informe-clientes-comparativa": {
      type: "view",
      view: "InformeClientesComparativa",
    },
    "/informe-clientes-comparativa/:idClienteProp": {
      type: "view",
      view: "InformeClientesComparativa",
    },
    "/informe-clientes-nuevos": { type: "view", view: "InformeClientesNuevos" },
    "/informe-consumo-cliente": { type: "view", view: "InformeConsumoCliente" },
    "/informe-ventas-articulo": { type: "view", view: "InformeVentasArticulo" },
    "/informe-ventas-familia": { type: "view", view: "InformeVentasFamilia" },
    "/informe-ventas-poblacion": {
      type: "view",
      view: "InformeVentasPoblacion",
    },
    "/informe-tratos-agente": { type: "view", view: "InformeTratosAgente" },
    "/informe-contactos-agente": { type: "view", view: "InformeContactosAgente" },
    "/informe-mapa": { type: "view", view: "InformeMapa" },
    "/prevision-compras": { type: "view", view: "PrevisionCompras" },
  },
  dependencies: [core, login, ventas, almacen],
  menus: {
    app: AppMenu,
  },
  schemas,
};
