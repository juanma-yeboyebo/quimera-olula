import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./PresupuestosCli.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  logic: {
    ...parent.logic,
    presupuestoEditable: presupuesto => presupuesto.editable,
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
    onPresupuestosBufferSeccionConfirmada: ["onPresupuestosSeccionConfirmada"],
    onPresupuestosBufferSeccionCancelada: ["onPresupuestosSeccionCancelada"],
  };
};
