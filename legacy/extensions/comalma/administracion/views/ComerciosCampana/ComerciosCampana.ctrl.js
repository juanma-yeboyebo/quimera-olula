import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./ComerciosCampana.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  logic: {
    ...parent.logic,
  },
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onVolverCampanasClicked: [
      {
        type: "navigate",
        url: (_, { campanaActiva }) => `/campanas/${campanaActiva}`,
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
