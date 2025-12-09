import core from "@quimera-extension/core";

import AppMenu from "./static/appmenu";
import schemas from "./static/schemas";
import * as Campana from "./views/Campana";
import * as CampanaNueva from "./views/CampanaNueva";
import * as Campanas from "./views/Campanas";
import * as CampanasFiltro from "./views/Campanas/CampanasFiltro";
import * as CampanasMaster from "./views/Campanas/CampanasMaster";
import * as CampanasComercio from "./views/CampanasComercio";
import * as CampanasComercioDetail from "./views/CampanasComercio/CampanasComercioDetail";
import * as CampanasComercioMaster from "./views/CampanasComercio/CampanasComercioMaster";
import * as Comercio from "./views/Comercio";
import * as ComercioNuevo from "./views/ComercioNuevo";
import * as Comercios from "./views/Comercios";
import * as ComerciosFiltro from "./views/Comercios/ComerciosFiltro";
import * as ComerciosMaster from "./views/Comercios/ComerciosMaster";
import * as ComerciosCampana from "./views/ComerciosCampana";
import * as ComerciosCampanaDetail from "./views/ComerciosCampana/ComerciosCampanaDetail";
import * as ComerciosCampanaMaster from "./views/ComerciosCampana/ComerciosCampanaMaster";
import * as ConsultaCompraCP from "./views/ConsultaCompraCP";
import * as ConsultaCompras from "./views/ConsultaCompras";
import * as ConsultaComprasFiltro from "./views/ConsultaCompras/ConsultaComprasFiltro";
import * as ConsultaCompraUser from "./views/ConsultaCompraUser";
import * as ConsultaCompraUserFiltro from "./views/ConsultaCompraUser/ConsultaCompraUserFiltro";
import * as ConsultaUsuarios from "./views/ConsultaUsuarios";
import * as ConsultaUsuariosFiltro from "./views/ConsultaUsuarios/ConsultaUsuariosFiltro";
import * as ConsultaVentaComercio from "./views/ConsultaVentaComercio";
import * as ConsultaVentaComercioFiltro from "./views/ConsultaVentaComercio/ConsultaVentaComercioFiltro";
import * as Header from "./views/Header";
import * as Home from "./views/Home";
import * as Login from "./views/Login";
import * as VentaComercio from "./views/VentaComercio";
import * as VentasComercio from "./views/VentasComercio";
import * as VentasComercioMaster from "./views/VentasComercio/VentasComercioMaster";

export default {
  path: "extensions/comalma",
  views: {
    Campana,
    Campanas,
    CampanaNueva,
    Comercios,
    Comercio,
    ComercioNuevo,
    Home,
    CampanasComercio,
    ComerciosCampana,
    ConsultaCompras,
    ConsultaCompraUser,
    ConsultaCompraCP,
    ConsultaVentaComercio,
    ConsultaUsuarios,
    Login,
    Header,
    VentaComercio,
    VentasComercio,
  },
  subviews: {
    "Comercios/ComerciosMaster": ComerciosMaster,
    "Comercios/ComerciosFiltro": ComerciosFiltro,
    "Campanas/CampanasMaster": CampanasMaster,
    "Campanas/CampanasFiltro": CampanasFiltro,
    "ConsultaCompras/ConsultaComprasFiltro": ConsultaComprasFiltro,
    "ConsultaCompraUser/ConsultaCompraUserFiltro": ConsultaCompraUserFiltro,
    "ConsultaCompraCP/ConsultaCompraCPFiltro": ConsultaVentaComercioFiltro,
    "ConsultaVentaComercio/ConsultaVentaComercioFiltro": ConsultaVentaComercioFiltro,
    "ConsultaUsuarios/ConsultaUsuariosFiltro": ConsultaUsuariosFiltro,
    "CampanasComercio/CampanasComercioMaster": CampanasComercioMaster,
    "CampanasComercio/CampanasComercioDetail": CampanasComercioDetail,
    "ComerciosCampana/ComerciosCampanaMaster": ComerciosCampanaMaster,
    "ComerciosCampana/ComerciosCampanaDetail": ComerciosCampanaDetail,
    "VentasComercio/VentasComercioMaster": VentasComercioMaster,
  },
  routes: {
    "/": { type: "view", view: "Home" },
    "/establecimientos": { type: "view", view: "Comercios" },
    "/establecimientos/:idComercio": { type: "view", view: "Comercios" },
    "/campanas": { type: "view", view: "Campanas" },
    "/campanas/:idCampana": { type: "view", view: "Campanas" },
    "/campanas/comercio": { type: "view", view: "CampanasComercio" },
    "/campanas/comercio/:idComercio": { type: "view", view: "CampanasComercio" },
    "/establecimientos/campana": { type: "view", view: "ComerciosCampana" },
    "/establecimientos/campana/:idCampana": { type: "view", view: "ComerciosCampana" },
    // "/consultas/compras": { type: "view", view: "ConsultaCompras" },
    "/consultas/comprasporusuario": { type: "view", view: "ConsultaCompraUser" },
    "/consultas/compraporcp": { type: "view", view: "ConsultaCompraCP" },
    "/consultas/ventasporestablecimiento": { type: "view", view: "ConsultaVentaComercio" },
    "/consultas/usuarios": { type: "view", view: "ConsultaUsuarios" },
    "/establecimientos/ventas/:idComercio": { type: "view", view: "VentasComercio" },
    "/establecimientos//ventas/:idComercio/:idVenta": { type: "view", view: "VentaComercio" },
    // "/ventasComercio/:idComercio": { type: "view", view: "VentasComercio" },
  },
  menus: {
    app: AppMenu,
  },
  dependencies: [core],
  schemas,
};
