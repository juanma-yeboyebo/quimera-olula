import { util } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Ventas.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  logic: {
    ...parent.logic,
  },
  idComercio: util.getUser().idcomercio,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    addNuevaVenta: [
      {
        condition: ({ response }) => response.data.length > 0,
        type: "setStateKey",
        plug: ({ response }, { ventas }) => {
          const idValue = response.data[0]?.idVenta;
          const nuevo = !ventas.idList.includes(idValue);
          response.data[0]._status = "new";

          return {
            path: "ventas",
            value: {
              ...ventas,
              dict: {
                ...ventas.dict,
                [response.data[0]?.idVenta]: response.data[0],
              },
              idList: nuevo ? [idValue, ...ventas.idList] : [...ventas.idList],
            },
          };
        },
      },
      {
        condition: ({ response, url }, { ventas, escritorio }) =>
          escritorio &&
          response.data.length > 0 &&
          response.data[0]?.idVenta !== ventas.current &&
          !!url,
        type: "navigate",
        url: ({ response, url, id }) => `${url}/${response.data[0]?.idVenta}`,
      },
      {
        condition: ({ response }) => !response.data.length,
        type: "grape",
        name: `deleteKeyVentas`,
        plug: ({ id }) => ({ id }),
      },
      {
        type: "grape",
        name: `onReloadVentasItemSucceded`,
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
