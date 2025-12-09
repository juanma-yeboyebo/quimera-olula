import { getSchemas, util } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./ContactoMD.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onNuevaNotaEnter: [
      {
        type: "post",
        schema: getSchemas().notaContacto,
        action: "add_nota",
        data: (_, { contacto, nuevaNota }) => ({
          codContacto: contacto.data.codContacto,
          texto: nuevaNota,
          fecha: util.today(),
        }),
        success: "onNotaCreated",
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
