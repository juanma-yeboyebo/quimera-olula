// import { MasterCtrl, MasterAPI } from 'core/lib'
// import { MasterCtrl, MasterAPI } from 'quimera/lib'
// import schemas from '../../static/schemas'
// import { util } from 'quimera'
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Articulo.ctrl.yaml";

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
    onVolverClicked: [
      {
        type: "function",
        function: () => window.history.back(),
      },
    ],
  };
};
