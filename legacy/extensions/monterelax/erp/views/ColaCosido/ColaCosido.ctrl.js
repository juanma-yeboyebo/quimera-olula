//import { ModelAPI, ModelCtrl } from "quimera/lib";
import { util } from "quimera";

import schemas from "./ColaCosido.schema";

export const state = parent => ({
  ...parent,
  upConfirmada: "",
  cargandoDatos: true,
  colaCosido: [],
  historialCosido: []
});

export const bunch = parent => ({
  ...parent,
  onInit: [
    {
      type: "grape",
      name: "getCola"
    },
    {
      type: "grape",
      name: "getHistorial"
    }
  ],
  getCola: [
    {
      type: "get",
      schema: schemas.colaCosido,
      filter: () => ({
        and: [
          ["pr_trabajadores.idusuario", "eq", `'${util.getUser().user}'`],
          ["pr_tareas.estado", "eq", "'EN CURSO'"],
          ["pr_unidadesproducto.mx_confirmarcosido", "eq", "false"],
          ["pr_tareas.idtipotarea", "in", ["'COS_AL'", "'COS_FU'"]]
        ],
      }),
      page: () => ({limit: 200}),
      success: "onColaRecibida"
    }
  ],
  getHistorial: [
    {
      type: "get",
      schema: schemas.colaCosido,
      filter: () => ({
        and: [
          ["pr_trabajadores.idusuario", "eq", `'${util.getUser().user}'`],
          ["pr_tareas.estado", "eq", "'EN CURSO'"],
          ["pr_unidadesproducto.mx_confirmarcosido", "eq", "true"],
          ["pr_tareas.idtipotarea", "in", ["'COS_AL'", "'COS_FU'"]],
        ],
      }),
      page: () => ({limit: 200}),
      success: "onHistoricoRecibido"
    }
  ],
  onColaRecibida: [
    {
      type: "setStateKeys",
      plug: ({ response }) => ({
        keys: { colaCosido: response.data, cargandoDatos: false }
      })
    }
  ],
  onHistoricoRecibido: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({ path: "historialCosido", value: response.data })
    }
  ],
  onConfirmarCosido: [
    {
      type: "setStateKey",
      plug: ({idunidad}) => ({ path: "upConfirmada", value: idunidad })
    },
    {
      type: "patch",
      schema: schemas.colaCosido,
      action: "confirmar_cosido",
      id: () => "-static-",
      data: (_p, {upConfirmada}) => ({ unidad: upConfirmada }),
      success: "onConfirmarSucceeded"
    }
  ],
  onConfirmarSucceeded: [
    {
      type: "showMessage",
      plug: (_p, {upConfirmada}) => ({
        mensaje: `Unidad ${upConfirmada} confirmada`,
        tipoMensaje: "success"
      })
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "upConfirmada", value: "" })
    },
    {
      type: "grape",
      grape: "getCola"
    },
    {
      type: "grape",
      grape: "getHistorial"
    }
  ],
  onDeshacerCosido: [
    {
      type: "setStateKey",
      plug: ({idunidad}) => ({ path: "upConfirmada", value: idunidad })
    },
    {
      type: "patch",
      schema: schemas.colaCosido,
      action: "deshacer_cosido",
      id: () => "-static-",
      data: (_p, {upConfirmada}) => ({ unidad: upConfirmada }),
      success: "onDeshacerSucceeded"
    },
  ],
  onDeshacerSucceeded: [
    {
      type: "showMessage",
      plug: (_p, {upConfirmada}) => ({
        mensaje: `Unidad ${upConfirmada} añadida a la cola`,
        tipoMensaje: "success"
      })
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "upConfirmada", value: "" })
    },
    {
      type: "grape",
      grape: "getHistorial"
    },
    {
      type: "regrape",
      grape: "getCola"
    }
  ]
});
