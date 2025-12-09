import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./MoviLotes.ctrl.yaml";

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
    onBorrarMoviloteCliClick: [
      {
        type: "userConfirm",
        question: () => ({
          titulo: "La línea será eliminada",
          cuerpo: "",
          textoSi: "CONFIRMAR",
          textoNo: "CANCELAR",
        }),
        onConfirm: "onBorrarMoviloteCliClickConfirmed",
      },
    ],
    onCantidadChanged: [],
    onVolverLoteClicked: [
      // {
      //   type: "function",
      //   function: (payload, state) => console.log(payload, state),
      // },
      {
        condition: (_, { codPreparacionDePedido }) => !!codPreparacionDePedido,
        type: "navigate",
        url: (_, { codPreparacionDePedido }) =>
          `/sh_preparaciondepedidos/${codPreparacionDePedido}`,
      },
      {
        condition: (_, { idPedido }) => !!idPedido,
        type: "navigate",
        url: (_, { idPedido }) => `/generarpreparaciones/${idPedido}`,
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
