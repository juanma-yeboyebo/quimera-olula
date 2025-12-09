import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./MisFacturas.ctrl.yaml";

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
//   facturas: ModelCtrl(getSchemas().misFacturas),
//   lineas: ModelCtrl(getSchemas().lineasfacturas)

// })

// export const bunch = parent => ({
//   ...parent,
//   ...ModelAPI({
//     name: 'facturas',
//     id: 'idFactura',
//     schema: getSchemas().misFacturas,
//     url: '/areaclientes/facturas'
//   }),
//   ...ModelAPI({
//     name: 'lineas',
//     id: 'idLinea',
//     schema: getSchemas().lineasfacturas
//   }),
//   onInit: [
//     {
//       type: 'grape',
//       name: 'getFacturas'
//     }
//   ],
//   onAtrasClicked: [
//     {
//       type: 'navigate',
//       url: () => '/areaclientes/facturas'
//     },
//     {
//       type: 'setStateKey',
//       plug: () => ({ path: 'facturas.current', value: null })
//     }
//   ],
//   // onIdFacturasChanged: [
//   //   {
//   //     condition: (payload, { facturas }) => facturas.current !== '',
//   //     type: 'grape',
//   //     name: 'getLineas'
//   //   }
//   // ],
// })
