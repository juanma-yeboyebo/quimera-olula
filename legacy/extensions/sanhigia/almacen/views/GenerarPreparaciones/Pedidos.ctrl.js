import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";
import { util } from "quimera";

import data from "./Pedidos.ctrl.yaml";

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
    // onPedidosFilterChanged: [
    //   {
    //     type: "grape",
    //     name: "onPedidosFilterChangedSobrecarga"
    //   }
    // ],
    onAgruparPedidosGenerarPreparacionesSuccess: [
      {
        type: "setStateKey",
        plug: () => ({ path: "agrupandoPedidos", value: false }),
      },
      {
        type: "navigate",
        url: ({ response }) => `/sh_preparaciondepedidos/${response.codpreparacion}`,
      },
    ],
    onAgruparPedidosGenerarPreparacionesError: [
      {
        type: "setStateKey",
        plug: () => ({ path: "agrupandoPedidos", value: false }),
      },
      {
        type: "showMessage",
        plug: ({ response }) => ({
          mensaje: response,
          tipoMensaje: "error",
        }),
      },
    ],
    onPedidosBufferSeccionConfirmada: ["onPedidoSeccionConfirmada"],
    onPedidosBufferSeccionCancelada: ["onPedidoSeccionCancelada"],
  };
};
