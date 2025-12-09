import { util } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./FirmaAlbaran.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  firmaAlbaran: {
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
    onFirmaAlbaranCodcontactoChanged: [
      {
        condition: ({ value }) => !value || value === "",
        type: "setStateKey",
        plug: (...[, { firmaAlbaran }]) => ({
          path: "firmaAlbaran",
          value: { ...firmaAlbaran, firmadopor: "", cifnif: "", codContacto: "" },
        }),
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
