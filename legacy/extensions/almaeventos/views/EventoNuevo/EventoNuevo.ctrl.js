import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./EventoNuevo.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onEventoBufferChanged: [
      {
        type: "setStateKey",
        plug: payload => ({ path: `evento.buffer.${payload.field}`, value: payload.value ?? 0 }),
      },
      {
        type: "grape",
        name: "loadEvento",
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
