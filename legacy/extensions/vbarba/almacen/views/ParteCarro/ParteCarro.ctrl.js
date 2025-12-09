import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./ParteCarro.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  logic: {
    ...parent.logic,
    // parteEditable: parte => parte.firmado && parte.firmado === false,
    parteEditable: parte => !parte.firmado,
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
    onAtrasClicked: [
      {
        condition: (_, { urlAtras }) => urlAtras,
        type: "navigate",
        url: (_, { urlAtras }) => urlAtras,
      },
      {
        condition: (_, { urlAtras }) => !urlAtras,
        type: "grape",
        name: "cancelParteCarro",
      },
    ],
  };
};
