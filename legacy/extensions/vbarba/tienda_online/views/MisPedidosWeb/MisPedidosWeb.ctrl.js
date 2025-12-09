import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./MisPedidosWeb.ctrl.yaml";

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
//   carritos: ModelCtrl(getSchemas().ToCarritos),
//   lineas: ModelCtrl(getSchemas().lineascarritos)

// })

// export const bunch = parent => ({
//   ...parent,
//   ...ModelAPI({
//     name: 'carritos',
//     id: 'idCarrito',
//     schema: getSchemas().ToCarritos,
//     url: '/areaclientes/carritos'
//   }),
//   ...ModelAPI({
//     name: 'lineas',
//     id: 'idLinea',
//     schema: getSchemas().lineascarritos
//   }),
//   onInit: [
//     {
//       type: 'grape',
//       name: 'getCarritos'
//     }
//   ],
//   onAtrasClicked: [
//     {
//       type: 'navigate',
//       url: () => '/areaclientes/carritos'
//     },
//     {
//       type: 'setStateKey',
//       plug: () => ({ path: 'carritos.current', value: null })
//     }
//   ],
//   // onIdCarritosChanged: [
//   //   {
//   //     condition: (payload, { carritos }) => carritos.current !== '',
//   //     type: 'grape',
//   //     name: 'getLineas'
//   //   }
//   // ],
// })
