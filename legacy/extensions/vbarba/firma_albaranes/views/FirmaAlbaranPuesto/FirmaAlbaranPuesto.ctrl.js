import { util } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./FirmaAlbaranPuesto.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  firmaAlbaran: {
    idFirma: null,
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
    checkEstadoEnEsperaSuccess: [
      {
        condition: ({ response }) => response.data[0].estado === 'En espera',
        type: "grape",
        name: "estadoEnEsperaConfirmado"
      },
      {
        condition: ({ response }) => response.data[0].estado !== 'En espera',
        type: "grape",
        name: "estadoEnEsperaModificado"
      }
    ]
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
