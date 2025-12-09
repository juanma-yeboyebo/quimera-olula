import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./MisAlbaranes.ctrl.yaml";

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
//   albaranes: ModelCtrl(getSchemas().misAlbaranes),
//   lineas: ModelCtrl(getSchemas().lineasalbaranes)

// })

// export const bunch = parent => ({
//   ...parent,
//   ...ModelAPI({
//     name: 'albaranes',
//     id: 'idAlbaran',
//     schema: getSchemas().misAlbaranes,
//     url: '/areaclientes/albaranes'
//   }),
//   ...ModelAPI({
//     name: 'lineas',
//     id: 'idLinea',
//     schema: getSchemas().lineasalbaranes
//   }),
//   onInit: [
//     {
//       type: 'grape',
//       name: 'getAlbaranes'
//     }
//   ],
//   onAtrasClicked: [
//     {
//       type: 'navigate',
//       url: () => '/areaclientes/albaranes'
//     },
//     {
//       type: 'setStateKey',
//       plug: () => ({ path: 'albaranes.current', value: null })
//     }
//   ],
//   // onIdAlbaranesChanged: [
//   //   {
//   //     condition: (payload, { albaranes }) => albaranes.current !== '',
//   //     type: 'grape',
//   //     name: 'getLineas'
//   //   }
//   // ],
// })
