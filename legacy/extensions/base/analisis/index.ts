import core from "@quimera-extension/core";

import AppMenu from "./static/appmenu";
import schemas from "./static/schemas";
import * as NavegadorVentas from "./views/NavegadorVentas";
import * as VentasFiltros from "./views/NavegadorVentas/VentasFiltros";

export * from "./comps";

export default {
  path: "extensions/base-analisis",
  views: {
    NavegadorVentas,
  },
  subviews: {
    "NavegadorVentas/VentasFiltros": VentasFiltros,
  },
  routes: {
    "/analisis/ventas": { type: "view", view: "NavegadorVentas" },
  },
  menus: {
    app: AppMenu,
  },
  dependencies: [core],
  schemas,
};
