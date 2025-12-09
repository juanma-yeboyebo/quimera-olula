import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Reparacion.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    // onInit: [
    //   {
    //     type: "setStateKey",
    //     plug: ({ initReparacion }) => ({
    //       path: "lineaseventos.filter.and",
    //       value: [["codevento", "eq", `${initReparacion?.codReparacion}`]],
    //     }),
    //   },
    //   {
    //     type: "setStateKey",
    //     plug: ({ initReparacion }) => ({
    //       path: "contactosevento.filter.and",
    //       value: [["codevento", "eq", `${initReparacion?.idReparacion}`]],
    //     }),
    //   },
    // ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
