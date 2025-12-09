import { util } from "quimera";

import schemas from "./ColaMontado.schema";

export const state = parent => ({
  ...parent,
  cargandoDatos: true,
  upConfirmada: "",
  unidades: [],
  montadas: [],
  filtroCola: {
    and: [
      ["pr_trabajadores.idusuario", "eq", `'${util.getUser().user}'`],
      ["pr_unidadesproducto.estado", "not_in", ["'MONTADO'", "'TERMINADO'", "'CARGADO'"]],
      ["pr_unidadesproducto.mx_preparadomontadoext", "eq", "'No'"]
    ]
  },
  filtroHistorico: {
    and: [
      ["pr_trabajadores.idusuario", "eq", `'${util.getUser().user}'`],
      ["pr_unidadesproducto.estado", "not_in", ["'MONTADO'", "'TERMINADO'", "'CARGADO'"]],
      ["pr_unidadesproducto.mx_preparadomontadoext", "eq", "'Si'"]
    ]
  }
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
      schema: schemas.colaMontado,
      filter: (_p, {filtroCola}) => (filtroCola),
      page: () => ({limit: 200}),
      success: "onColaRecibida"
    }
  ],
  getHistorial: [
    {
      type: "get",
      schema: schemas.colaMontado,
      filter: (_p, {filtroHistorico}) => (filtroHistorico),
      page: () => ({limit: 200}),
      success: "onHistoricoRecibido"
    }
  ],
  onColaRecibida: [
    {
      type: "setStateKeys",
      plug: ({ response }) => ({
        keys: { unidades: response.data, cargandoDatos: false }
      })
    }
  ],
  onHistoricoRecibido: [
    {
      type: "setStateKeys",
      plug: ({ response }) => ({
        keys: { montadas: response.data, cargandoDatos: false }
      })
    }
  ],
  onTerminarMontado: [
    {
      log: (payload) => ["PAYLOAD___", payload],
      type: "setStateKey",
      plug: ({ idunidad }) => ({ path: "upConfirmada", value: idunidad })
    },
    {
      type: "patch",
      schema: schemas.colaMontado,
      action: "preparar_montadoext",
      id: () => "-static-",
      data: (_p, {upConfirmada}) => ({unidad: upConfirmada}),
      success: "onTerminarSucceeded"
    }
  ],
  onDeshacerMontado: [
    {
      type: "setStateKey",
      plug: ({idunidad}) => ({ path: "upConfirmada", value: idunidad })
    },
    {
      type: "patch",
      schema: schemas.colaMontado,
      action: "deshacer_unidad_preparada",
      id: () => "-static-",
      data: (_p, {upConfirmada}) => ({ unidad: upConfirmada }),
      success: "onDeshacerSucceeded"
    },
  ],
  onTerminarSucceeded: [
    {
      type: "showMessage",
      plug: (_p, {upConfirmada}) => ({
        mensaje: `${upConfirmada} terminada correctamente`,
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
  onDeshacerSucceeded: [
    {
      type: "showMessage",
      plug: (_p, {upConfirmada}) => ({
        mensaje: `${upConfirmada} desmarcada correctamente`,
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
  ]
})
