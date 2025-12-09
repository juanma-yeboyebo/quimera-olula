import { getSchemas, util } from "quimera";
import { DetailAPI, DetailCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  idTarea: null,
  tarea: DetailCtrl(getSchemas().nuevaTarea),
  tareaNow: false,
  tipoTarea: "Llamada",
});

export const bunch = parent => ({
  ...parent,
  ...DetailAPI({
    name: "tarea",
    key: "idTarea",
    schema: getSchemas().nuevaTarea,
  }),
  onInit: [
    {
      type: "setStateKey",
      plug: ({ idTrato }) => ({ path: "tarea.idTrato", value: idTrato }),
    },
    {
      type: "setStateKey",
      plug: ({ codIncidencia }) => ({ path: "tarea.codIncidencia", value: codIncidencia }),
    },
    {
      type: "setStateKey",
      plug: ({ tipoTarea }) => ({ path: "tipoTarea", value: tipoTarea }),
    },
    {
      condition: (_, { tipoTarea }) => !!tipoTarea,
      type: "setStateKey",
      plug: ({ tipoTarea }) => ({
        path: "tarea.tipo",
        value: tipoTarea ? tipoTarea.charAt(0).toUpperCase() + tipoTarea.slice(1) : "Llamada",
      }),
    },
  ],
  onTareaSaved: [
    {
      type: "showMessage",
      plug: () => ({ mensaje: "Tarea creada", tipoMensaje: "success" }),
    },
    {
      condition: () => !util.getUser().googleapicredentials,
      type: "showMessage",
      plug: () => ({
        mensaje:
          "Tarea creada, pero no has otorgado permisos para sincronizar con google calendar. Puedes hacerlo desde el menú de usuario.",
        tipoMensaje: "warning",
      }),
    },
    {
      condition: (_, { tareaNow }) => !tareaNow,
      type: "function",
      function: () => window.history.back(),
    },
    {
      condition: (_, { tareaNow }) => tareaNow && tareaNow === true,
      type: "navigate",
      url: ({ response }) => `/ss/tarea/${response.pk}/now`,
    },
    {
      type: "setStateKey",
      plug: () => ({
        path: "tareaNow",
        value: false,
      }),
    },
  ],
  onSaveTareaFailed: [
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "No se pudo crear la tarea",
        tipoMensaje: "error",
      }),
    },
  ],
  onSaveTareaNowClicked: [
    {
      type: "setStateKey",
      plug: () => ({
        path: "tareaNow",
        value: true,
      }),
    },
    {
      type: "grape",
      name: "onSaveTareaClicked",
    },
  ],
});
