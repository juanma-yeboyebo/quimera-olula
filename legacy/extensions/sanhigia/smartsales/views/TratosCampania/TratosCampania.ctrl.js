import { getSchemas } from "quimera";
import {
  applyBunch,
  DetailAPI,
  ModelAPI,
  ModelCtrl,
  shortcutsBunch,
  shortcutsState,
} from "quimera/lib";

import data from "./TratosCampania.ctrl.yaml";

export const state = parent => ({
  ...parent,
  estadosTratos: {
    "-": { key: "-", nombre: "Pendientes", checked: true },
    "Ganado": { key: "Ganado", nombre: "Ganados", checked: false },
    "Perdido": { key: "Perdido", nombre: "Perdidos", checked: false },
  },
  externalFilter: null,
  tratosCampania: ModelCtrl(getSchemas().tratoCampania),
  campania: ModelCtrl(getSchemas().campania),
  totalesTratos: null,
  showFilter: false,
  codagente: null,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => ({
  ...parent,
  ...DetailAPI({
    name: "campania",
    key: "idCampania",
    schema: getSchemas().campania,
    forcePk: true,
  }),
  ...ModelAPI({
    name: "tratosCampania",
    id: "idTrato",
    action: "get_for_campania",
    forcePk: true,
    schema: getSchemas().tratoCampania,
  }),
  ...shortcutsBunch(data.shortcuts),
  ...applyBunch(data.bunch, parent),
  seteaOrigen: [
    {
      type: "setStateKey",
      plug: () => ({
        path: "origen",
        value: window.location.href.includes("leadpacientes") ? "leadpacientes" : "campania",
      }),
    },
  ],
  getExternalFilterInSession: [
    {
      type: "function",
      function: ({ idCampania }, { tareas }) => {
        const externalFilter = sessionStorage.getItem("TratosCampaniaFilterExternal");
        if (!!externalFilter) {
          return { response: JSON.parse(externalFilter) };
        }
        return { response: [{ filter: ["estado", "in", ["-"]] }, { filter: ["idcampania", "eq", idCampania] }] };
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
      plug: ({ response, idCampania }) => ({
        keys: {
          estadosTratos: response.estadosTratosAux,
          externalFilter: response?.inClause?.length > 0 ? [{ filter: ["estado", "in", response?.inClause] }, { filter: ["idcampania", "eq", idCampania] }] : [{ filter: ["idcampania", "eq", idCampania] }]
        },
      }),
    },
  ],
  getTratosData: [
    {
      type: "grape",
      name: "getTratosCampania",
    },
    {
      type: "grape",
      name: "getCampania",
    },
  ],
  onTratosCampaniaItemSelected: [
    {
      // log: (payload) => ["hola mundo", payload],
      type: "navigate",
      url: ({ payload, item }, { origen }) =>
        `/ss/${origen}/${item["idCampania"]}/tratos/${item["idTrato"]}`,
    },
  ],
  onShowFilterClicked: [
    {
      type: "setStateKey",
      plug: (_, { showFilter }) => ({ path: "showFilter", value: !showFilter }),
    },
  ],
  onAtrasClicked: [
    // leadpacientes
    {
      type: "navigate",
      url: (_, { campania, origen }) =>
        `/ss/${origen === "leadpacientes" ? origen : "campanias"}/${campania.idCampania}`,
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "tratosCampania.current", value: null }),
    },
  ],
  refreshTrato: [
    {
      type: "get",
      schema: getSchemas().tratoCampania,
      id: (_, { tratosCampania }) => tratosCampania.current,
      action: "get_for_campania",
      forcePk: true,
      success: "onGetTrato",
    },
  ],
  onGetTrato: [
    {
      type: "setStateKey",
      plug: ({ response }, { tratosCampania }) => ({
        path: `tratosCampania.dict.${tratosCampania.current}`,
        value: response.data[0],
      }),
    },
  ],
  onTratosCampaniaFilterChanged: [
    {
      condition: ({ value }, { showFilter }) => value && Object.keys(value).length && showFilter,
      type: "setStateKey",
      plug: () => ({ path: "showFilter", value: false }),
    },
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "tratosCampania.filter", value }),
    },
    {
      type: "grape",
      name: "getTratosData",
    },
  ],
  deletedTrato: [
    {
      type: "navigate",
      url: (_, { campania, origen }) => `/ss/${origen}/${campania.idCampania}/tratos`,
    },
    {
      type: "grape",
      name: "getTratosData",
    },
  ],
  onSincronizarConACClicked: [
    {
      type: "userConfirm",
      question: () => ({
        titulo: "¿Sincronizar con Active Campaign?",
        cuerpo: "Se van a sincronizar los contactos de la campaña con Active Campaign",
        textoSi: "ACEPTAR",
        textoNo: "CANCELAR",
      }),
      onConfirm: "onSincronizarConACClickedConfirm",
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
      plug: ({ response }, { idCampania }) => {
        const filtroAux = response.filtro;
        filtroAux.push({
          filter: ["idcampania", "eq", idCampania],
        });

        return { path: "externalFilter", value: filtroAux };
      },
    },
    {
      type: "setStateKey",
      plug: ({ response }) => ({ path: "externalFilter", value: response.filtro }),
    },
  ],
});
