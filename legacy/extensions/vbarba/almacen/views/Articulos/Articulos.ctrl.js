// import { MasterCtrl, MasterAPI } from 'core/lib'
// import schemas from '../../static/schemas'
// import { util } from 'quimera'
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Articulos.ctrl.yaml";

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
    onPedidosBufferSeccionConfirmada: ["onPedidoSeccionConfirmada"],
    onPedidosBufferSeccionCancelada: ["onPedidoSeccionCancelada"],
    onIrAClicked: [
      {
        type: "navigate",
        url: ({ ruta }) => ruta,
      },
    ],
    onArticulosItemSelected: [
      {
        type: "navigate",
        url: ({ payload, item }) => `/articulos/${item["referencia"]}/articulo`,
      },
      {
        type: "grape",
        name: `onIdArticulosProp`,
        plug: ({ item }) => ({ id: item["referencia"] }),
      },
    ]
  };
};
