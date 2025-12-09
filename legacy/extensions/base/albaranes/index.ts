// export * from './comps'
import core from "@quimera-extension/core";
import login from "@quimera-extension/login";

import AppMenu from "./static/appmenu";
import schemas from "./static/schemas";
import * as AlbaranCli from "./views/AlbaranCli";
import * as AlbaranesCli from "./views/AlbaranesCli";
import * as AlbaranDetalle from "./views/AlbaranesCli/AlbaranDetalle";
import * as AlbaranesFiltro from "./views/AlbaranesCli/AlbaranesFiltro";
import * as AlbaranesMaster from "./views/AlbaranesCli/AlbaranesMaster";
import * as AlbaranDirCliente from "./views/AlbaranesCli/DirCliente";
import * as AlbaranesCliNuevo from "./views/AlbaranesCliNuevo";
import * as AlbaranesVenta from "./views/AlbaranesVenta";
import * as FiltroCabeceraAlbaranes from "./views/AlbaranesVenta/CabeceraFiltro";
import * as ListadoAlbaranesMobile from "./views/AlbaranesVenta/ListadoMobile";
import * as LineaAlbaranCli from "./views/LineaAlbaranCli";
import * as LineaAlbaranCliNueva from "./views/LineaAlbaranCliNueva";

export * from "./comps";

export default {
  path: "extensions/base/albaranes",
  views: {
    AlbaranesVenta,
    LineaAlbaranCli,
    LineaAlbaranCliNueva,
    AlbaranCli,
    AlbaranesCli,
    AlbaranesCliNuevo,
  },
  subviews: {
    "AlbaranesVenta/CabeceraFiltro": FiltroCabeceraAlbaranes,
    "AlbaranesVenta/ListadoMobile": ListadoAlbaranesMobile,
    "AlbaranesCli/DirCliente": AlbaranDirCliente,
    "AlbaranesCli/AlbaranesMaster": AlbaranesMaster,
    "AlbaranesCli/AlbaranesFiltro": AlbaranesFiltro,
    "AlbaranesCli/AlbaranDetalle": AlbaranDetalle,
  },
  routes: {
    "/albaranesVenta": { type: "view", view: "AlbaranesVenta" },
    // "/firmaAlbaran": { type: "view", view: "../firma_albaranes/views/FirmaAlbaran" },
    "/ventas/albaranes": { type: "view", view: "AlbaranesCli" },
    "/ventas/albaranes/:idAlbaran": { type: "view", view: "AlbaranesCli" },
  },
  dependencies: [core, login],
  schemas,
  menus: {
    app: AppMenu,
  },
};
