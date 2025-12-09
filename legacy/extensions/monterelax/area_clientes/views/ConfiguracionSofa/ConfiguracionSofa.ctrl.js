import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./ConfiguracionSofa.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
    volverCatalogo: [
      {
        type: "function",
        function: (_, { callbackVolver }) => callbackVolver(),
      },
    ],
    reseteaMisConfiguraciones: [
      {
        type: "setStateKey",
        plug: payload => ({ path: "misConfiguraciones", value: [] }),
      },
      {
        type: "grape",
        name: "calculaTotalPrecio",
      },
    ],
    addConfiguracionPorIndice: [
      {
        type: "setStateKey",
        plug: ({ result }, { misConfiguraciones, configuraciones }) => {
          if (!result.destination) {
            return;
          }
          const { source, destination } = result;
          const auxStatus = misConfiguraciones;
          const configuracion = configuraciones.dict[result.draggableId.substr(2)];
          auxStatus.splice(destination.index, 0, configuracion);

          return { path: "misConfiguraciones", value: auxStatus };
        },
      },
      {
        type: "grape",
        name: "calculaTotalPrecio",
      },
    ],
    recolocaConfiguracion: [
      {
        type: "setStateKey",
        plug: ({ result }, { misConfiguraciones }) => {
          if (!result.destination) {
            return;
          }
          const { source, destination } = result;
          const auxStatus = misConfiguraciones;
          const [removed] = auxStatus.splice(source.index, 1);
          auxStatus.splice(destination.index, 0, removed);

          return { path: "misConfiguraciones", value: auxStatus };
        },
      },
    ],
    onEliminarConfiguracionClicked: [
      {
        type: "setStateKey",
        plug: ({ indice }, { misConfiguraciones }) => {
          const auxStatus = misConfiguraciones;
          auxStatus.splice(indice, 1);

          return { path: "misConfiguraciones", value: auxStatus };
        },
      },
      {
        type: "grape",
        name: "calculaTotalPrecio",
      },
    ],
  };
};
