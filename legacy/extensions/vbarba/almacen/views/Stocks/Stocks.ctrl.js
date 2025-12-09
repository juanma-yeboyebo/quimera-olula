import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Stocks.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  logic: {
    ...parent.logic,
    pedidoEditable: pedido => pedido.editable && pedido.estadoPda !== "Enviado",
  },
  estadoVista: "lanzadoConResultados",
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
    onIrAClicked: [
      {
        type: "navigate",
        url: ({ ruta }) => ruta,
      },
    ],
    onStocksItemSelected: [
      {
        type: "navigate",
        url: ({ payload, item }) => `/stocks/${item["referencia"]}/articulo`,
      },
      {
        type: "grape",
        name: `onIdStocksProp`,
        plug: ({ item }) => ({ id: item["referencia"] }),
      },
    ]

  };
};
