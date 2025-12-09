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
  tratosFarma: ModelCtrl(getSchemas().tratoFarma),
  totalesTratos: null,
  showFilter: false,
  modalNuevoTratoVisible: false,
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "tratosFarma",
    id: "idTrato",
    schema: getSchemas().tratoFarma,
    url: "/ss/tratosfarma",
  }),
  onInit: [
    {
      type: "grape",
      name: "getExternalFilterInSession",
    },
    // {
    //   type: "grape",
    //   name: "getTratosData",
    // },
  ],
  getExternalFilterInSession: [
    {
      type: "function",
      function: ({ idCampania }, { tareas }) => {
        const externalFilter = sessionStorage.getItem("TratosFarmaFilterExternal");
        if (!!externalFilter) {
          return { response: JSON.parse(externalFilter) };
        }
        return { response: [{ filter: ["estado", "in", ["-"]] }] };
      },
      success: "checkEstadosTratosInicial",
    },
  ],
  checkEstadosTratosInicial: [
    {
      type: "function",
      function: ({ response }, { estadosTratos }) => {
        let inClause = [];
        let estadosTratosAux = { ...estadosTratos };
        if (response?.response[0]?.filter[0] === 'estado') {
          inClause = response?.response[0]?.filter[2]
        }

        estadosTratosAux["-"].checked = inClause.includes("-");
        estadosTratosAux["Ganado"].checked = inClause.includes("Ganado");
        estadosTratosAux["Perdido"].checked = inClause.includes("Perdido");

        return { estadosTratosAux, inClause };
      },
      success: "setEstadosTratosInicial",
    },
  ],
  setEstadosTratosInicial: [
    {
      type: "setStateKeys",
      plug: ({ response }) => ({
        keys: {
          estadosTratos: response.estadosTratosAux,
          externalFilter: response?.inClause?.length > 0 ? [{ filter: ["estado", "in", response?.inClause] }] : []
        },
      }),
    },
  ],
  getTratosData: [
    {
      // log: (payload, { tratosFarma }) => ["mimensaje_getTratosData", tratosFarma.filter],
      type: "grape",
      name: "getTratosFarma",
      plug: () => ({ getTratosFarmaParams: { farma: true } }),
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
      plug: () => ({ path: "tratosFarma.current", value: null }),
    },
  ],
  refreshTrato: [
    {
      type: "get",
      schema: getSchemas().tratoFarma,
      id: (_, { tratosFarma }) => tratosFarma.current,
      success: "onGetTrato",
    },
  ],
  onGetTrato: [
    {
      type: "setStateKey",
      plug: ({ response }, { tratosFarma }) => ({
        path: `tratosFarma.dict.${tratosFarma.current}`,
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
  //     filter: (_, { tratosFarma }) => ({
  //       ...tratosFarma.filter,
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
  onTratosFarmaFilterChanged: [
    {
      condition: ({ value }, { showFilter }) => value && Object.keys(value).length && showFilter,
      type: "setStateKey",
      plug: () => ({ path: "showFilter", value: false }),
    },
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "tratosFarma.filter", value }),
    },
    {
      type: "grape",
      name: "getTratosData",
    },
  ],
  deletedTrato: [
    {
      type: "navigate",
      url: () => `/ss/tratosfarma`,
    },
    {
      type: "grape",
      name: "getTratosData",
    },
  ],
  onNuevoTratoClicked: [
    {
      type: "setStateKey",
      plug: () => ({ path: "modalNuevoTratoVisible", value: true }),
    },
  ],
  onCerrarCrearTrato: [
    {
      type: "setStateKey",
      plug: () => ({ path: "modalNuevoTratoVisible", value: false }),
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
      // log: ({ response }) => ['mimensaje_onExternalFilterChanged', response.filtro],
      type: "setStateKey",
      plug: ({ response }) => ({ path: "externalFilter", value: response.filtro }),
    },
  ],
});
