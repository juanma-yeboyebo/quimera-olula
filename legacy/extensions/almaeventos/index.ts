import core from "@quimera-extension/core";

import AppMenu from "./static/appmenu";
import schemas from "./static/schemas";
import * as CalendarioEventos from "./views/CalendarioEventos";
import * as CalendarioEventosFiltro from "./views/CalendarioEventos/CalendarioEventosFiltro";
import * as CalendarioGuardado from "./views/CalendarioGuardado";
import * as EventoNuevo from "./views/EventoNuevo";

export default {
  path: "extensions/almaeventos",
  views: {
    CalendarioEventos,
    CalendarioGuardado,
    EventoNuevo,
  },
  subviews: {
    "CalendarioEventos/CalendarioEventosFiltro": CalendarioEventosFiltro,
  },
  routes: {
    "/": { type: "view", view: "CalendarioEventos" },
    "/eventos": { type: "view", view: "CalendarioEventos" },
    "/calendarios/:hash": { type: "view", view: "CalendarioGuardado" },
  },
  dependencies: [core],
  menus: {
    app: AppMenu,
  },
  schemas,
};
