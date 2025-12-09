import { ModelAPI, ModelCtrl } from "quimera/lib";

import schemas from "./MisPedidos.schema";

export const state = parent => ({
  ...parent,
  pedidos: ModelCtrl(schemas.pedidoscli),
  lineas: ModelCtrl(schemas.lineaspedido),
  pendientes: true,
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "pedidos",
    id: "idPedido",
    schema: schemas.pedidoscli,
    url: "/mispedidos",
  }),
  ...ModelAPI({
    name: "lineas",
    id: "idLinea",
    schema: schemas.lineaspedido,
  }),
  onInit: [
    {
      type: "grape",
      name: "cambioPendientes",
    },
  ],
  onSwitchClicked: [
    {
      type: "setStateKey",
      plug: payload => ({ path: "pendientes", value: payload.item }),
    },
    {
      type: "grape",
      name: "cambioPendientes",
    },
  ],
  cambioPendientes: [
    {
      type: "setStateKey",
      plug: (...[, { pendientes }]) => ({
        path: "pedidos.filter",
        value: {
          and: [...(pendientes === true ? [["servido", "in", ["'No'", "'Parcial'"]]] : [])],
        },
      }),
    },
    {
      type: "grape",
      name: "getPedidos",
    },
  ],
  onAtrasClicked: [
    {
      type: "navigate",
      url: () => "/mispedidos",
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "pedidos.current", value: null }),
    },
  ],
  onIdPedidosChanged: [
    {
      type: "function",
      function: (...[, { pedidos }]) => {},
    },
    {
      condition: (_payload, { pedidos }) => pedidos.current,
      type: "grape",
      name: "getLineas",
    },
  ],
});
