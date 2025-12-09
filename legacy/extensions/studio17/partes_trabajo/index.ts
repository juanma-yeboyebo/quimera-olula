import core from "@quimera-extension/core";

import AppMenu from "./static/appmenu";
import schemas from "./static/schemas";
import * as LineaParteNueva from "./views/LineaParteNueva";
import * as ParteNuevo from "./views/ParteNuevo";
import * as PartesTrabajo from "./views/PartesTrabajo";
import * as Filtro from "./views/PartesTrabajo/Filtro";
import * as Master from "./views/PartesTrabajo/Master";
import * as ParteTrabajo from "./views/ParteTrabajo";
import * as s17LineaParte from "./views/s17LineaParte";

export default {
  path: "extensions/studio17/partes-trabajo",
  views: {
    PartesTrabajo,
    ParteNuevo,
    ParteTrabajo,
    s17LineaParte,
    LineaParteNueva,
  },
  subviews: {
    "PartesTrabajo/Master": Master,
    "PartesTrabajo/Filtro": Filtro,
  },
  routes: {
    "/": { type: "view", view: "PartesTrabajo" },
    "/partes-trabajo": { type: "view", view: "PartesTrabajo" },
    // '/partes-trabajo/nuevo': { type: 'view', view: 'ParteNuevo' },
    "/partes-trabajo/:codParte": { type: "view", view: "PartesTrabajo" },
  },
  dependencies: [core],
  menus: {
    app: AppMenu,
  },
  schemas,
};
