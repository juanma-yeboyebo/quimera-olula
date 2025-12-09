import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./CampaniaLeadsNueva.ctrl.yaml";

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
        function: ({ field, index, value }, { campaniaLeads }) => {
          const productosOfertar = campaniaLeads.buffer.productosOfertar;
          productosOfertar[index][field] = value;

          return { productosOfertar };
        },
        success: [
          {
            type: "setStateKey",
            plug: ({ response }) => ({
              path: `campaniaLeads.buffer.productosOfertar`,
              value: response.productosOfertar,
            }),
          },
        ],
      },
    ],
  };
};
