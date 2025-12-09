import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./LineaPedidoCompra.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});
console.log("applyBunch", applyBunch);
export const bunch = parent => ({
  ...parent,
  ...shortcutsBunch(data.shortcuts),
  irAMovilotes: [
    {
      type: "navigate",
      url: ({ idLinea, idPedido }) => `/pedidosdecompra/${idPedido}/movilotes/${idLinea}`,
    },
  ],
  ...applyBunch(data.bunch, parent),
});
