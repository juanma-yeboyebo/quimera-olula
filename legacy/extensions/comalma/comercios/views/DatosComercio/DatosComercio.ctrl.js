import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./DatosComercio.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  comercio: {
    nombre: "",
    email: "",
    tipo: "",
  },
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onComercioBufferChanged: [
      {
        type: "setStateKey",
        plug: payload => ({ path: `comercio.buffer.${payload.field}`, value: payload.value ?? 0 }),
      },
      {
        type: "grape",
        name: "loadComercio",
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
