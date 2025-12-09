import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./CampaniaNueva.ctrl.yaml";

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
    onProductoOfertarListChanged: [
      {
        type: "function",
        function: ({ field, index, value }, { campania }) => {
          const productosOfertar = campania.buffer.productosOfertar;
          productosOfertar[index][field] = value;

          return { productosOfertar };
        },
        success: [
          {
            type: "setStateKey",
            plug: ({ response }) => ({
              path: `campania.buffer.productosOfertar`,
              value: response.productosOfertar,
            }),
          },
        ],
      },
    ],
    onProductoChanged: [
      {
        type: "function",
        function: (
          { option },
          { campania, modoListaIncluidos, modoListaExcluidos, listaCampania },
        ) => {
          const productos = {};
          if (!campania?.buffer?.productos["lista_incluidos"]) {
            productos["lista_incluidos"] = {};
            productos["lista_incluidos"]["refs"] = [];
            productos["lista_incluidos"]["tipo"] = modoListaIncluidos;
          } else {
            productos["lista_incluidos"] = campania.buffer.productos["lista_incluidos"];
          }
          if (!campania?.buffer?.productos["lista_excluidos"]) {
            productos["lista_excluidos"] = {};
            productos["lista_excluidos"]["refs"] = [];
            productos["lista_excluidos"]["tipo"] = modoListaExcluidos;
          } else {
            productos["lista_excluidos"] = campania.buffer.productos["lista_excluidos"];
          }
          productos[listaCampania]["refs"].push(option);

          return { productos };
        },
        success: [
          {
            type: "setStateKey",
            plug: ({ response }) => ({
              path: `campania.buffer.productos`,
              value: response.productos,
            }),
          },
        ],
      },
    ],
    onTipoListaChanged: [
      {
        condition: ({ lista }, { campania }) => !!campania?.buffer?.productos[lista],
        type: "function",
        function: ({ lista, value }, { campania }) => {
          const productos = campania.buffer.productos;
          productos[lista]["tipo"] = value;

          return { productos };
        },
        success: [
          {
            type: "setStateKey",
            plug: ({ response }) => ({
              path: `campania.buffer.productos`,
              value: response.productos,
            }),
          },
        ],
      },
    ],
  };
};
