import { getSchemas, util } from "quimera";
import { ModelAPI, ModelCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  conTareasAtrasadas: false,
  estadosTratos: {
    "-": { key: "-", nombre: "Pendientes", checked: true },
    "Ganado": { key: "Ganado", nombre: "Ganados", checked: false },
    "Perdido": { key: "Perdido", nombre: "Perdidos", checked: false },
  },
  externalFilter: [{ filter: ["estado", "in", ["-"]] }],
  tratos: ModelCtrl(getSchemas().trato),
  tratosTareasAtrasadas: ModelCtrl(getSchemas().trato),
  totalesTratos: null,
  showFilter: false,
  modo: null,
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "tratos",
    id: "idTrato",
    schema: getSchemas().trato,
    url: "/ss/tratos",
  }),
  ...ModelAPI({
    name: "tratosTareasAtrasadas",
    id: "idTrato",
    schema: getSchemas().trato,
    url: "/ss/tratos/modo/tareasAtrasadas",
  }),
  onInit: [
    {
      condition: ({ modo }) => modo,
      type: "setStateKey",
      plug: ({ modo }) => ({ path: "modo", value: modo }),
    },
    {
      condition: ({ modo }) => !modo,
      type: "grape",
      name: "getTratosData",
    },
    {
      condition: ({ modo }) => !!modo && modo === "tareasAtrasadas",
      type: "grape",
      name: "getTratosTareasAtrasadasData",
    },
    {
      condition: ({ modo }) => !!modo && modo === "observadorfarma",
      type: "grape",
      name: "getTratosObservadorFarma",
    },
  ],
  getTratosData: [
    {
      type: "grape",
      name: "getTratos",
    },
  ],
  getTratosTareasAtrasadasData: [
    {
      type: "setStateKey",
      plug: () => ({ path: "conTareasAtrasadas", value: true }),
    },
    {
      type: "grape",
      name: "getTratosTareasAtrasadas",
      plug: () => ({
        getTratosTareasAtrasadasParams: {
          conTareasAtrasadas: true,
        },
      }),
    },
  ],
  getTratosObservadorFarma: [
    {
      type: "setStateKey",
      plug: (_, { externalFilter }) => {
        const filtroAux = externalFilter;
        filtroAux.push({
          filter: ["idtipotrato", "eq", util.getUser().tratolicenciafarma],
        });

        return { path: "externalFilter", value: filtroAux };
      },
    },
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
  onGetTratosSucceded: [
    {
      type: "grape",
      name: "getTotalesTratos",
    },
  ],
  onGetTratosTareasAtrasadasSucceded: [
    {
      type: "grape",
      name: "getTotalesTratos",
    },
  ],
  getTotalesTratos: [
    {
      type: "get",
      schema: getSchemas().totalesTratos,
      action: "get_totales",
      id: () => "-static-",
      filter: (_, { tratos, tratosTareasAtrasadas, modo }) => {
        return modo === "tareasAtrasadas"
          ? { ...tratosTareasAtrasadas.filter }
          : { ...tratos.filter };
      },
      params: (_, { conTareasAtrasadas }) => ({ conTareasAtrasadas }),
      success: "onGetTotalesTratosSucceeded",
    },
  ],
  onGetTotalesTratosSucceeded: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({
        path: "totalesTratos",
        value: response.data,
      }),
    },
  ],
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
  onTratosTareasAtrasadasFilterChanged: [
    {
      condition: ({ value }, { showFilter }) => value && Object.keys(value).length && showFilter,
      type: "setStateKey",
      plug: () => ({ path: "showFilter", value: false }),
    },
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "tratosTareasAtrasadas.filter", value }),
    },
    {
      type: "grape",
      name: "getTratosTareasAtrasadasData",
    },
  ],
  deletedTrato: [
    {
      type: "navigate",
      url: () => `/ss/tratos`,
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
        modo === "observadorfarma" &&
          filtroAux.push({
            filter: ["idtipotrato", "eq", util.getUser().tratolicenciafarma],
          });

        return { path: "externalFilter", value: filtroAux };
      },
    },
    {
      type: "setStateKey",
      plug: ({ response }) => ({ path: "externalFilter", value: response.filtro }),
    },
  ],
  onTratoClicked: [
    {
      type: "setStateKey",
      plug: ({ idTrato }) => ({ path: "tratos.current", value: idTrato }),
    },
    {
      type: "navigate",
      url: ({ idTrato }) => `/ss/tratos/${idTrato}`,
    },
  ],
  onTratoCreated: [
    {
      type: "navigate",
      url: ({ idTrato }) => `/ss/tratos/${idTrato}`,
    },
    {
      type: "grape",
      name: "getTratosData",
    },
  ],
  onTratoUpdated: [
    {
      type: "grape",
      name: "getTratosData",
    },
  ],
});
