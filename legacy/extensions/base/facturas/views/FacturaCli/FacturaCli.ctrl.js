import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./FacturaCli.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  logic: {
    ...parent.logic,
    facturaEditable: factura => factura.editable,
  },
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onFacturaBufferChanged: [
      {
        type: "setStateKey",
        plug: payload => ({ path: `factura.buffer.${payload.field}`, value: payload.value ?? 0 }),
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
