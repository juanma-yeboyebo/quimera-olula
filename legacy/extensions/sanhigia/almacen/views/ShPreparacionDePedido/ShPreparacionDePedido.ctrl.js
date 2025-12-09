import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./ShPreparacionDePedido.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  ordenLineas: {
    field: "codubicacion",
    direction: "ASC",
  },
  logic: {
    ...parent.logic,
    carritoEditable: carrito => carrito.editable && carrito.estadoPda !== "Enviado",
  },
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onCantidadChanged: [],
    onAtrasClicked: [
      {
        type: "function",
        function: () => window.history.back(),
      },
    ],
    focusCodBarras: [
      {
        type: 'function',
        function: (_, {linea}) => console.log("focus")
      },
      {
        condition: () => !!document.getElementById("codBarras"),
        type: "function",
        function: () => document.getElementById("codBarras").select(),
      },
    ],
    // onTdbLineasPedidoCliColumnClicked: [
    //   {
    //     condition: (payload, state) => payload.data.order,
    //     type: "grape",
    //     name: "calculaOrdenLineas",
    //   },
    //   {
    //     condition: (payload, state) => payload.data.order,
    //     type: "grape",
    //     name: "onCerrarLineaSuccess",
    //   },
    // ],
    calculaOrdenLineas: [
      {
        type: "setStateKey",
        plug: (payload, { ordenLineas }) => {
          const OrdenLineasActual = ordenLineas;
          let direction = "ASC";
          if (payload.data.order === OrdenLineasActual.field) {
            direction = OrdenLineasActual.direction === "ASC" ? "DESC" : "ASC";
          }
          const OrdenLineasFinal = {
            field: payload.data.order,
            direction,
          };
  
          return { path: "OrdenLineas", value: OrdenLineasFinal };
        },
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
