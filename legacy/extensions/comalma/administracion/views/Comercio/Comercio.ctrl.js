import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Comercio.ctrl.yaml";

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
    irACampanasComercio: [
      {
        type: "navigate",
        url: ({ idComercio }) => `/campanas/comercio/${idComercio}`,
      },
    ],
    onVerVentasComercioClicked: [
      {
        type: "navigate",
        url: ({ idComercio }) => `/establecimientos/ventas/${idComercio}`,
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
