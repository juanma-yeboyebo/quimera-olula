import { util } from "quimera";
import { ModelAPI, ModelCtrl } from "quimera/lib";

import schemas from "./CosidoInterno.schema";

export const state = parent => ({
  ...parent,
  cargandoDatos: true,
  unidades: ModelCtrl(schemas.unidades),
  filtroCola: {
    and: [
      ["pr_trabajadores.idusuario", "eq", `'${util.getUser().user}'`],
      ["pr_unidadesproducto.estado", "not_in", ["'MONTADO'", "'TERMINADO'", "'CARGADO'"]],
    ],
  },
  iniciada: false,
  pausada: false,
  upSeleccionada: null,
  contador: 0,
  contadorPendientes: 0
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "unidades",
    id: "idUnidad",
    schema: schemas.unidades,
    url: "/colaCosidoInterno"
  }),
  onInit: [
    {
      type: "grape",
      name: "getContador"
    },
    {
      type: "grape",
      name: "getContadorPendientes"
    },
    {
      type: "grape",
      name: "getUnidades"
    },
  ],
  onGetUnidadesSucceded: [
    {
      type: "setStateKeys",
      plug: ({ response }) => ({
        keys: {
          cargandoDatos: false,
        }
      })
    },
    {
      condition: (...[, { unidades }]) => !!unidades.current,
      type: "grape",
      name: "onIdUnidadesChanged"
    }
  ],
  getContador: [
    {
      type: "get",
      schema: schemas.unidades,
      action: "count_terminadas",
      id: () => "-static-",
      success: "onGetContadorSucceeded"
    }
  ],
  getContadorPendientes: [
    {
      type: "get",
      schema: schemas.unidades,
      action: "count_pendientes",
      id: () => "-static-",
      success: "onGetPendientesSucceeded"
    }
  ],
  onGetContadorSucceeded: [
    {
      log: ({ response }) => [`Contador${response.result}`],
      condition: ({ response }) => response.result >= 0,
      type: "setStateKeys",
      plug: ({ response }) => ({
        keys: {
          contador: response.result,
        }
      })
    }
  ],
  onGetPendientesSucceeded: [
    {
      log: ({ response }) => [`Contador${response.result}`],
      condition: ({ response }) => response.result >= 0,
      type: "setStateKeys",
      plug: ({ response }) => ({
        keys: {
          contadorPendientes: response.result
        }
      })
    }
  ],
  onIdUnidadesChanged: [
    {
      log: (...[, { unidades }]) => [`Current${unidades.current}`, " unidades ", unidades],
      condition: (...[, { unidades }]) => !!unidades.current && unidades.dict[unidades.current],
      type: "setStateKeys",
      plug: (_p, { unidades }) => ({
        keys: {
          iniciada: unidades.dict[unidades.current].estado === "EN COSIDO",
          pausada: unidades.dict[unidades.current].pausada === "Si",
          upSeleccionada: unidades.dict[unidades.current]
        }
      })
    }
  ],
  onAtrasClicked: [
    {
      type: "navigate",
      url: () => "/colaCosidoInterno",
    },
    {
      type: "setStateKeys",
      plug: (_p, { unidades }) => ({
        keys: {
          unidades: {
            ...unidades,
            current: null
          },
          upSeleccionada: null,
          iniciada: false,
          pausada: false
        }
      })
    }
  ],
  onIniciarClicked: [
    {
      type: "patch",
      schema: schemas.unidades,
      action: "iniciar_tarea",
      id: () => "-static-",
      data: (_p, { upSeleccionada }) => ({ unidad: upSeleccionada }),
      success: "onIniciarSucceeded"
    }
  ],
  onTerminarClicked: [
    {
      type: "patch",
      schema: schemas.unidades,
      action: "terminar_tarea",
      id: () => "-static-",
      data: (_p, { upSeleccionada }) => ({ unidad: upSeleccionada }),
      success: "onTerminarSucceeded"
    }
  ],
  onPausarClicked: [
    {
      type: "patch",
      schema: schemas.unidades,
      action: "pausar_unidad",
      id: () => "-static-",
      data: (_p, { upSeleccionada }) => ({ unidad: upSeleccionada }),
      success: "onPausarSucceeded"
    }
  ],
  onReanudarClicked: [
    {
      type: "patch",
      schema: schemas.unidades,
      action: "reanudar_unidad",
      id: () => "-static-",
      data: (_p, { upSeleccionada }) => ({ unidad: upSeleccionada }),
      success: "onReanudarSucceeded"
    }
  ],
  onPausarSucceeded: [
    {
      type: "appDispatch",
      name: "mostrarMensaje",
      plug: (_p, { upSeleccionada }) => ({
        mensaje: `${upSeleccionada.idUnidad} pausada correctamente`,
        tipoMensaje: "success"
      })
    },
    {
      type: "grape",
      name: "getUnidades"
    },
    {
      type: "setStateKeys",
      plug: () => ({ 
        keys: { 
          pausada: true
        }
      })
    }
  ],
  onReanudarSucceeded: [
    {
      type: "appDispatch",
      name: "mostrarMensaje",
      plug: (_p, { upSeleccionada }) => ({
        mensaje: `${upSeleccionada.idUnidad} reanudada correctamente`,
        tipoMensaje: "success"
      })
    },
    {
      type: "grape",
      name: "getUnidades"
    },
    {
      type: "setStateKeys",
      plug: () => ({
        keys: {
          pausada: false
        }
      })
    }
  ],
  onTerminarSucceeded: [
    {
      type: "appDispatch",
      name: "mostrarMensaje",
      plug: (_p, { upSeleccionada }) => ({
        mensaje: `${upSeleccionada.idUnidad} terminada correctamente`,
        tipoMensaje: "success"
      })
    },
    {
      type: "grape",
      name: "onInit"
    },
    {
      type: "setStateKeys",
      plug: () => ({
        keys: {
          iniciada: false,
          pausada: false,
          upSeleccionada: null
        }
      })
    }
  ],
  onIniciarSucceeded: [
    {
      type: "appDispatch",
      name: "mostrarMensaje",
      plug: (_p, { upSeleccionada }) => ({
        mensaje: `${upSeleccionada.idUnidad} iniciada correctamente`,
        tipoMensaje: "success"
      })
    },
    {
      type: "grape",
      name: "getUnidades"
    },
    {
      type: "setStateKeys",
      plug: () => ({
        keys: {
          iniciada: true,
          pausada: false
        }
      })
    }
  ]
});
