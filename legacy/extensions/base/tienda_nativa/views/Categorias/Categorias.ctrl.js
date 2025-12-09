import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Categorias.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  logic: {
    ...parent.logic,
    categoriaEditable: categoria => categoria.editable,
  },
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
    onCategoriasBufferSeccionConfirmada: ["onCategoriaSeccionConfirmada"],
    onCategoriasBufferSeccionCancelada: ["onCategoriaSeccionCancelada"],
  };
};
