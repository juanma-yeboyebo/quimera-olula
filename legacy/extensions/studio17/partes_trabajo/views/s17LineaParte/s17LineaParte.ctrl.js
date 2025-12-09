import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./s17LineaParte.ctrl.yaml";
import { util } from "quimera";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    checkLimpiaObservaciones: [
      {
        condition: (_, {linea}) => linea.buffer.proyecto !== util.getUser().codecentroespecial,
        type: 'grape',
        name: 'limpiaObservaciones'
      }
    ]
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
