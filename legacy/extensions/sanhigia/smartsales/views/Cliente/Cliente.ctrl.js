import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Cliente.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onInit: [
      // {
      //   type: "setStateKey",
      //   plug: ({ initCliente }) => ({
      //     path: "lineaseventos.filter.and",
      //     value: [["codevento", "eq", `${initCliente?.codCliente}`]],
      //   }),
      // },
      // {
      //   type: "grape",
      //   name: "getLineaseventos",
      // },
      {
        type: "grape",
        name: "dameContactos",
      },
    ],
    dameContactos: [
      {
        type: "setStateKey",
        plug: ({ initCliente }, {cliente}) => ({
          path: "contactos.filter.and",
          value: [["crm_contactos.codcliente", "eq", "'" + cliente.data?.codCliente + "'"]],
        }),
      },
      {
        type: "grape",
        name: "getContactos",
      },
    ],
    onCrearNuevoContactoClicked: [
      {
        type: "setStateKey",
        plug: () => ({ path: "modalCrearContactoVisible", value: true }),
      },
    ],
    onCerrarCrearContacto: [
      {
        type: "grape",
        name: "dameContactos",
      },
      {
        type: "setStateKey",
        plug: () => ({ path: "modalCrearContactoVisible", value: false }),
      },
    ],
    onAnadirContactoClicked: [
      {
        type: "setStateKey",
        plug: () => ({ path: "modalCrearContactoVisible", value: true }),
      },
    ],
    onCerrarAnadirContacto: [
      {
        type: "grape",
        name: "dameContactos",
      },
      {
        type: "setStateKey",
        plug: () => ({ path: "modalCrearContactoVisible", value: false }),
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),

  };
};
