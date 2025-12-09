import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./LineaPedidoCliNueva.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => ({
  ...parent,
  ...shortcutsBunch(data.shortcuts),
  ...applyBunch(data.bunch, parent),
});
