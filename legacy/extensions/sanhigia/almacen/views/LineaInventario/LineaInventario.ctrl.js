import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./LineaInventario.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});
export const bunch = parent => ({
  ...parent,
  ...shortcutsBunch(data.shortcuts),
  irAMovilotes: [
    {
      type: "navigate",
      url: ({ idLinea, idPedido }) => `/generarpreparaciones/${idPedido}/movilotes/${idLinea}`,
    },
  ],
  ...applyBunch(data.bunch, parent),
});
