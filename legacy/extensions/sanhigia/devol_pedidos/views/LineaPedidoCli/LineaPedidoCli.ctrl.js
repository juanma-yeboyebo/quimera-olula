import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./LineaPedidoCli.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});
console.log("applyBunch", applyBunch);
export const bunch = parent => ({
  ...parent,
  ...shortcutsBunch(data.shortcuts),
  ...applyBunch(data.bunch, parent),
});
