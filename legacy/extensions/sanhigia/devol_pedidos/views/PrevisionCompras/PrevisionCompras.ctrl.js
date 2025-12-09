import { util } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./PrevisionCompras.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  fechaDesde: util.oneYearAgo(),
  fechaHasta: util.today(),
});

export const bunch = parent => ({
  ...parent,
  ...shortcutsBunch(data.shortcuts),
  ...applyBunch(data.bunch, parent),
});
