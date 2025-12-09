import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Incidencia.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onNuevoPresupuestoIncidenciaError: [
      {
        type: "setStateKeys",
        plug: () => ({
          keys: {
            creandoPresupuesto: false,
            crearPresupuesto: false,
          },
        }),
      },
      {
        type: "showMessage",
        plug: ({ response }) => ({
          mensaje: response,
          tipoMensaje: "error",
        }),
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
