import { util } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./FirmaParteCarro.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  firmaParteCarro: {
    codContacto: "",
    firmadopor: "",
    cifnif: "",
    puesto: util.getUser()?.user,
    fecha: util.today(),
    hora: util.now(),
  },
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onFirmaParteCarroCodcontactoChanged: [
      {
        condition: ({ value }) => !value || value === "",
        type: "setStateKey",
        plug: (...[, { firmaParteCarro }]) => ({
          path: "firmaParteCarro",
          value: { ...firmaParteCarro, firmadopor: "", cifnif: "", codContacto: "" },
        }),
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
