import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./MoviLotesProv.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  logic: {
    ...parent.logic,
    carritoEditable: carrito => carrito.editable && carrito.estadoPda !== "Enviado",
  },
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onBorrarMoviloteProvClick: [
      {
        type: "userConfirm",
        question: () => ({
          titulo: "La línea será eliminada",
          cuerpo: "",
          textoSi: "CONFIRMAR",
          textoNo: "CANCELAR",
        }),
        onConfirm: "onBorrarMoviloteProvClickConfirmed",
      },
    ],
    onCantidadChanged: [],
    onVolverLoteClicked: [
      {
        condition: (_, { idPedido }) => !!idPedido,
        type: "navigate",
        url: (_, { idPedido }) => `/pedidosdecompra/${idPedido}`,
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
