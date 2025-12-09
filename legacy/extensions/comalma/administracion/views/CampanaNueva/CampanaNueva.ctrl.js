import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./CampanaNueva.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onCampanaBufferChanged: [
      {
        type: "setStateKey",
        plug: payload => ({ path: `campana.buffer.${payload.field}`, value: payload.value ?? 0 }),
      },
      {
        type: "grape",
        name: "loadCampana",
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
