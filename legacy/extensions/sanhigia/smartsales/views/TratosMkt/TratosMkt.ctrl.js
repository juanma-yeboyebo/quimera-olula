import { getSchemas } from "quimera";
import { ModelAPI, ModelCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  estadosTratos: {
    "-": { key: "-", nombre: "Pendientes", checked: true },
    "Ganado": { key: "Ganado", nombre: "Ganados", checked: false },
    "Perdido": { key: "Perdido", nombre: "Perdidos", checked: false },
  },
  externalFilter: [{ filter: ["estado", "in", ["-"]] }],
  tratos: ModelCtrl(getSchemas().trato),
  totalesTratos: null,
  showFilter: false,
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "tratos",
    id: "idTrato",
    schema: getSchemas().trato,
    url: "/ss/tratosmkt",
  }),
  onInit: [
    {
      type: "grape",
      name: "getTratosData",
    },
  ],
  getTratosData: [
    {
      type: "grape",
      name: "getTratos",
      plug: () => ({ getTratosParams: { mkt: true } }),
    },
    // {
    //   type: "grape",
    //   name: "getTotalesTratos",
    // },
  ],
  onShowFilterClicked: [
    {
      type: "setStateKey",
      plug: (_, { showFilter }) => ({ path: "showFilter", value: !showFilter }),
    },
  ],
  onAtrasClicked: [
    {
      type: "navigate",
      url: () => "/ss/dashboard",
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "tratos.current", value: null }),
    },
  ],
  refreshTrato: [
    {
      type: "get",
      schema: getSchemas().trato,
      id: (_, { tratos }) => tratos.current,
      success: "onGetTrato",
    },
  ],
  onGetTrato: [
    {
      type: "setStateKey",
      plug: ({ response }, { tratos }) => ({
        path: `tratos.dict.${tratos.current}`,
        value: response.data[0],
      }),
    },
  ],
  // getTotalesTratos: [
  //   {
  //     type: "get",
  //     schema: getSchemas().totalesTratos,
  //     action: "get_totales",
  //     id: () => "-static-",
  //     filter: (_, { tratos }) => ({
  //       ...tratos.filter,
  //     }),
  //     params: () => ({ mkt: true }),
  //     success: "onGetTotalesTratosSucceeded",
  //   },
  // ],
  // onGetTotalesTratosSucceeded: [
  //   {
  //     type: "setStateKey",
  //     plug: ({ response }) => ({
  //       path: "totalesTratos",
  //       value: response.data,
  //     }),
  //   },
  // ],
  onTratosFilterChanged: [
    {
      condition: ({ value }, { showFilter }) => value && Object.keys(value).length && showFilter,
      type: "setStateKey",
      plug: () => ({ path: "showFilter", value: false }),
    },
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "tratos.filter", value }),
    },
    {
      type: "grape",
      name: "getTratosData",
    },
  ],
  deletedTrato: [
    {
      type: "navigate",
      url: () => `/ss/tratosmkt`,
    },
    {
      type: "grape",
      name: "getTratosData",
    },
  ],
  onFiltroRapidoClicked: [
    {
      type: "setStateKey",
      plug: ({ key, value }) => ({ path: `estadosTratos.${key}.checked`, value }),
    },
    {
      type: "function",
      function: (_, { estadosTratos }) => {
        const estados = Object.values(estadosTratos)
          .filter(est => est.checked)
          .map(est => est.key);

        const filtro = estados.length > 0 ? [{ filter: ["estado", "in", estados] }] : [];

        return { filtro };
      },
      success: "onExternalFilterChanged",
    },
  ],
  onExternalFilterChanged: [
    {
      type: "setStateKey",
      plug: ({ response }, { modo }) => {
        const filtroAux = response.filtro;
        // modo === "observadorfarma" &&
        //   filtroAux.push({
        //     filter: ["idtipotrato", "eq", util.getUser().tratolicenciafarma],
        //   });

        return { path: "externalFilter", value: filtroAux };
      },
    },
    {
      type: "setStateKey",
      plug: ({ response }) => ({ path: "externalFilter", value: response.filtro }),
    },
  ],
});
