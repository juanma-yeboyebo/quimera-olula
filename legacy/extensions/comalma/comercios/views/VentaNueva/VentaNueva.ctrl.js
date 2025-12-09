import { util } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./VentaNueva.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  miIdComercio: util.getUser().idcomercio,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onVentaBufferChanged: [
      {
        type: "setStateKey",
        plug: payload => ({ path: `venta.buffer.${payload.field}`, value: payload.value ?? 0 }),
      },
      {
        type: "grape",
        name: "loadVenta",
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
