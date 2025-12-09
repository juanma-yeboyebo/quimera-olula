import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./PuestoFirma.ctrl.yaml";

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
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
    onIrAClicked: [
      {
        type: "navigate",
        url: ({ ruta }) => ruta,
      },
    ],
    llamaCallbackCerrar: [
      {
        type: "function",
        function: (_, { callbackCerrar }) => callbackCerrar(),
      },
    ],
  };
};
