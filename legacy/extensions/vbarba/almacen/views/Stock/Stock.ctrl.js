// import { util } from 'quimera'
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Stock.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  logic: {
    ...parent.logic,
    pedidoEditable: pedido => pedido.editable && pedido.estadoPda !== "Enviado",
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
    onPedidosBufferSeccionConfirmada: ["onPedidoSeccionConfirmada"],
    onPedidosBufferSeccionCancelada: ["onPedidoSeccionCancelada"],
    onIrAClicked: [
      {
        type: "navigate",
        url: ({ ruta }) => ruta,
      },
    ],
    onEditarArticuloClicked: [
      // {
      //   type: "grape",
      //   name: "cancelStock",window.location.href
      // },
      {
        type: "navigate",
        url: (_, { stock }) => `/stocks/articulo/${stock.data.referencia}`,
      },
    ],
    stockCambiado: [
      {
        // log: (_, { contacto }) => ["mimensaje_refreshCallback", contacto],
        type: "function",
        function: ({ field, value }, { callbackChanged, stock }) =>
          callbackChanged && callbackChanged({ referencia: stock.data.referencia, field, value }),
      },
    ],
  };
};
