import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./AlbaranesVenta.ctrl.yaml";

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
    onCrearESCarrosClicked: [
      {
        type: "userConfirm",
        question: () => ({
          titulo: "Crear parte de E/S carros",
          cuerpo:
            "El albarán seleccionado no está asociado a ningún parte de movimiento de carros existente. ¿Deseas crear uno?",
          textoSi: "CONFIRMAR",
          textoNo: "CANCELAR",
        }),
        onConfirm: "onCrearESCarrosConfrimado",
      },
    ],
  };
};
