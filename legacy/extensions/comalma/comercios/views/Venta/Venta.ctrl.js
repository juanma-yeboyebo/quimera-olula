import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Venta.ctrl.yaml";

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
    irAComerciosCampana: [
      {
        type: "navigate",
        url: ({ idCampana }) => `/comercios/campana/${idCampana}`,
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
