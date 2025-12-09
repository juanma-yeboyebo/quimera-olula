import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./MisPedidos.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};

// import { ModelCtrl, ModelAPI } from 'quimera/lib'
// import { getSchemas } from 'quimera'

// export const state = parent => ({
//   ...parent,
//   pedidos: ModelCtrl(getSchemas().misPedidos),
//   lineas: ModelCtrl(getSchemas().lineaspedidos)

// })

// export const bunch = parent => ({
//   ...parent,
//   ...ModelAPI({
//     name: 'pedidos',
//     id: 'idPedido',
//     schema: getSchemas().misPedidos,
//     url: '/areaclientes/pedidos'
//   }),
//   ...ModelAPI({
//     name: 'lineas',
//     id: 'idLinea',
//     schema: getSchemas().lineaspedidos
//   }),
//   onInit: [
//     {
//       type: 'grape',
//       name: 'getPedidos'
//     }
//   ],
//   onAtrasClicked: [
//     {
//       type: 'navigate',
//       url: () => '/areaclientes/pedidos'
//     },
//     {
//       type: 'setStateKey',
//       plug: () => ({ path: 'pedidos.current', value: null })
//     }
//   ],
//   // onIdPedidosChanged: [
//   //   {
//   //     condition: (payload, { pedidos }) => pedidos.current !== '',
//   //     type: 'grape',
//   //     name: 'getLineas'
//   //   }
//   // ],
// })
