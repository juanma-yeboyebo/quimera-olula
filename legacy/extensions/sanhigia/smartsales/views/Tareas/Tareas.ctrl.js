import { getSchemas } from "quimera";
import { ModelAPI, ModelCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  tareas: ModelCtrl(getSchemas().tarea),
  showFilter: false,
  estadosTareas: {
    Pendientes: { key: "Pendientes", nombre: "Pendientes", value: "false", checked: true },
    Completadas: { key: "Completadas", nombre: "Completadas", value: "true", checked: false },
  },
  externalFilter: [{ filter: ["completada", "in", ["false"]] }],
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "tareas",
    id: "idTarea",
    schema: getSchemas().tarea,
    url: "/ss/tareas",
  }),
  onInit: [
    {
      type: "grape",
      name: "getExternalFilterInSession",
    },
  ],
  getExternalFilterInSession: [
    {
      type: "function",
      function: (_, { externalFilter }) => {
        const externalFilterAux = sessionStorage.getItem("TareasFilterExternal");
        if (!!externalFilterAux) {
          return { response: JSON.parse(externalFilterAux) };
        }
        return { response: externalFilter };
      },
      success: "checkEstadosTareasInicial",
    },
  ],
  checkEstadosTareasInicial: [
    {
      type: "function",
      function: ({ response }, { estadosTareas }) => {
        const completadas = response?.response[0]?.filter[2];
        let estadosTareasAux = { ...estadosTareas };
        estadosTareasAux.Pendientes.checked = !!completadas && completadas.includes("false");
        estadosTareasAux.Completadas.checked = !!completadas && completadas.includes("true");

        return { estadosTareasAux, completadas };
      },
      success: "setEstadosTareasInicial",
    },
  ],
  setEstadosTareasInicial: [
    {
      type: "setStateKeys",
      plug: ({ response }) => ({
        keys: {
          estadosTareas: response.estadosTareasAux,
          externalFilter: response?.completadas?.length > 0 ? [{ filter: ["completada", "in", response.completadas] }] : []
        },
      }),
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
      plug: () => ({ path: "tareas.current", value: null }),
    },
  ],
  refreshTarea: [
    {
      type: "get",
      schema: getSchemas().tarea,
      id: (_, { tareas }) => tareas.current,
      success: "onGetTarea",
    },
  ],
  onGetTarea: [
    {
      type: "setStateKey",
      plug: ({ response }, { tareas }) => ({
        path: `tareas.dict.${tareas.current}`,
        value: response.data[0],
      }),
    },
  ],
  onFiltroRapidoClicked: [
    {
      type: "setStateKey",
      plug: ({ key, value }) => ({ path: `estadosTareas.${key}.checked`, value }),
    },
    {
      type: "function",
      function: (_, { estadosTareas }) => {
        const estados = Object.values(estadosTareas)
          .filter(est => est.checked)
          .map(est => est.value);

        const filtro = estados.length > 0 ? [{ filter: ["completada", "in", estados] }] : [];

        return { filtro };
      },
      success: "onExternalFilterChanged",
    },
  ],
  onExternalFilterChanged: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({ path: "externalFilter", value: response.filtro }),
    },
  ],
});
