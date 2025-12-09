import core from "@quimera-extension/core";

import schemas from "./static/schemas";
import * as FirmaAlbaran from "./views/FirmaAlbaran";
// import * as FirmaAlbaranPuesto from "./views/FirmaAlbaranPuesto";
// import * as AlbaranesPuestoFirma from "./views/AlbaranesPuestoFirma";
// import * as FiltroCabeceraAlbaranes from "./views/AlbaranesPuestoFirma/CabeceraFiltro";
// import * as ListadoAlbaranesMobile from "./views/AlbaranesPuestoFirma/ListadoMobile";

export default {
  path: "extensions/base-firma_albaranes",
  views: {
    FirmaAlbaran,
    // AlbaranesPuestoFirma,
    // FirmaAlbaranPuesto
  },
  subviews: {
    // "AlbaranesPuestoFirma/CabeceraFiltro": FiltroCabeceraAlbaranes,
    // "AlbaranesPuestoFirma/ListadoMobile": ListadoAlbaranesMobile,
  },
  routes: {
    "/firmaAlbaran": { type: "view", view: "FirmaAlbaran" },
    // "/albaranesPuesto": { type: "view", view:"AlbaranesPuestoFirma"}
  },
  dependencies: [core],
  schemas,

};
