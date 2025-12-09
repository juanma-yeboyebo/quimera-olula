import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Incidencias.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onAtrasClicked: [
      {
        type: "navigate",
        url: () => "/",
      },
      {
        type: "setStateKey",
        plug: () => ({ path: "incidencias.current", value: null }),
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
