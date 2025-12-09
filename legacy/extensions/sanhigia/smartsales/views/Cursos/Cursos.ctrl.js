import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Cursos.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onInit: [
      // {
      //   type: "setStateKey",
      //   plug: ({ initCurso }) => ({
      //     path: "cursos.filter.and",
      //     value: [["tipoevento", "eq", "Curso"]],
      //   }),
      // },
      {
        type: "grape",
        name: "getCursos",
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
