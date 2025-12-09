import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./AlbaranCli.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  logic: {
    ...parent.logic,
    albaranEditable: albaran => albaran.pteFactura,
  },
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onAlbaranBufferChanged: [
      {
        type: "setStateKey",
        plug: payload => ({ path: `albaran.buffer.${payload.field}`, value: payload.value ?? 0 }),
      },
      // {
      //   type: "grape",
      //   name: "loadAlbaran",
      // },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
