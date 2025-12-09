import { ModelAPI, ModelCtrl } from "quimera/lib";

import schemas from "./MisReparaciones.schema";

export const state = parent => ({
  ...parent,
  reparaciones: ModelCtrl(schemas.reparaciones),
  pendientes: true,
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "reparaciones",
    id: "idReparacion",
    schema: schemas.reparaciones,
    url: "/misreparaciones",
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
        path: "reparaciones.filter",
        value: {
          and: [...(pendientes === true ? [["estado", "in", ["PTE", "PTE RECOGIDA"]]] : [])],
        },
      }),
    },
    {
      type: "grape",
      name: "getReparaciones",
    },
  ],
  // onAtrasClicked: [
  //   {
  //     type: 'navigate',
  //     url: () => '/mispedidos'
  //   },
  //   {
  //     type: 'setStateKey',
  //     plug: () => ({ path: 'pedidos.current', value: null })
  //   }
  // ],
  // onIdPedidosChanged: [
  //   {
  //     type: 'function',
  //     function: (...[, { reparaciones }]) => { console.log('onIdReparacionesChanged', reparaciones.idList.length) }
  //   }
  // ]
});
