import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./ConsultaCompraUser.ctrl.yaml";

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
    compruebaFiltroVacio: [
      {
        condition: (_, { consultas }) =>
          consultas?.filter && Object.keys(consultas?.filter).length === 0,
        type: "grape",
        name: "filtroVacioComprobado",
        plug: () => ({ filtroAux: '{"and":[["1","eq","1"]]}' }),
      },
      {
        condition: (_, { consultas }) =>
          consultas?.filter && Object.keys(consultas?.filter).length > 0,
        type: "grape",
        name: "filtroVacioComprobado",
        plug: (_, { consultas }) => ({ filtroAux: JSON.stringify(consultas?.filter) }),
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
