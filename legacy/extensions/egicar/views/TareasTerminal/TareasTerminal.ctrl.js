import { getSchemas } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./TareasTerminal.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onDeleteTramoClicked: [
      {
        type: "userConfirm",
        question: ({ tramo }) => ({
          titulo: "¿Borrar tramo?",
          cuerpo: "El tramo seleccionado se eliminará de la lista de tramos definitivamente",
          textoSi: "CONFIRMAR",
          textoNo: "CANCELAR",
        }),
        onConfirm: "onBorrarTramoConfirmado",
      },
    ],
    onBorrarTramoConfirmado: [
      {
        type: "delete",
        schema: getSchemas().tramosTarea,
        id: ({ item }) => item.id,
        success: `dameTramos`,
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
