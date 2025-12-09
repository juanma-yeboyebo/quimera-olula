import { util } from "quimera";

import schemas from "./RecepcionCosido.schema";

export const state = parent => ({
  ...parent,
  recepcionCosido: [],
  filtroCola: {
    and: [
      ["pr_tareas.estado", "eq", "'EN CURSO'"],
      ["pr_tareas.idtipotarea", "in", ["'COS_AL'", "'COS_FU'"]],
    ]
  },
  filtro: {
    cosedor: ""
  }
});

export const bunch = parent => ({
  ...parent,
  onInit: [
    {
      type: "grape",
      name: "getRecepcionCosido"
    }
  ],
  getRecepcionCosido: [
    {
      type: "get",
      schema: schemas.recepcionCosido,
      //filter: (_p, {filtroCola, filtro}) => (filtroCola),
      filter: (_p, {filtroCola, filtro}) => (filtro.cosedor !== "" ? { and: [filtroCola, ["pr_trabajadores.idtrabajador", "eq", `'${filtro.cosedor}'`]] } : filtroCola),
      page: () => ({limit: 1000}),
      success: "onColaRecibida"
    }
  ],
  onColaRecibida: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({path: "recepcionCosido", value: response.data })
    }
  ],
  onTerminarTarea: [
    {
      condition: ({ cosido }) => cosido === false,
      type: "patch",
      schema: schemas.recepcionCosido,
      action: "confirmar_cosido",
      id: () => "-static-",
      data: ({idunidad}) => ({ unidad: idunidad }),
      success: []
    },
    {
      type: "patch",
      schema: schemas.recepcionCosido,
      action: "terminar_tarea_cosido",
      id: () => "-static-",
      data: ({idunidad}) => ({ unidad: idunidad }),
      success: "onTerminarTareaSucceeded"
    },
  ],
  onTerminarTareaSucceeded: [
    {
      type: "showMessage",
      plug: ({ idunidad }) => ({
        mensaje: `Tareas de unidad ${idunidad} terminadas correctamente`,
        tipoMensaje: "success"
      })
    },
    {
      type: "grape",
      name: "getRecepcionCosido"
    }
  ],
  onFiltroCosedorChanged: [
    {
      type: "setStateKey",
      plug: (payload) => ({path: "filtro.cosedor", value: payload.value ? payload.value : "" })
    },
    {
      type: "grape",
      name: "getRecepcionCosido"
    }
  ]
})
