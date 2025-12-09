import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./ParteTrabajo.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onFirmarParteClicked: [
      {
        type: "userConfirm",
        question: () => ({
          titulo: "Firmar parte",
          cuerpo: "Una vez firmado el parte no se podrá modificar.",
          textoSi: "CONFIRMAR",
          textoNo: "CANCELAR",
        }),
        onConfirm: "onFirmarParteConfrimado",
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
