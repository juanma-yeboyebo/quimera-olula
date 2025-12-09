import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Reparaciones.ctrl.yaml";

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
    //     plug: ({ initCurso }) => ({
    //       path: "reparaciones.filter.and",
    //       value: [["codcliente", "eq", util.getUser().codCliente]],
    //     }),
    //   },
    //   {
    //     type: "grape",
    //     name: "getReparaciones",
    //   },
    // ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
