import schemas from "../OrdenesCarga/OrdenesCarga.schema";

export const state = parent => ({
  ...parent,
  idOrdenDeCarga: "",
  ordenDeCarga: {},
  unidadesProducto: [],
  // Control
  abrirDialogo: false,
  progreso: { cargadas: 0, total: 0 },
});

export const bunch = parent => ({
  ...parent,
  onInit: [
    {
      type: "setStateKey",
      plug: ({ idOrdenDeCarga }) => {
        return { path: "idOrdenDeCarga", value: idOrdenDeCarga };
      }
    },
    {
      type: "grape",
      name: "cargarUnidadesProducto",
    }
  ],
  cargarUnidadesProducto: [
    {
      type: "get",
      schema: schemas.unidades_orden,
      filter: (payload, { idOrdenDeCarga }) => ["idordencarga", "eq", `'${idOrdenDeCarga}'`],
      success: "onUnidadesProductoRecibidas",
    }
  ],
  onUnidadesProductoRecibidas: [
    {
      type: "setStateKeys",
      plug: ({response}) => {
        function dameTela(up) {
          const tela = up.idtela;
          const telaMantas = up.idtelamantas;
          const telaComp = up.idtelacomp;
          let telas = tela;
          if (telaMantas && telaMantas !== tela) {
            telas += ` + ${telaMantas} (mantas)`;
          }
          if (telaComp !== telaMantas) {
            telas += ` + ${telaComp} (comp)`;
          }

          return telas;
        }

        return {
          keys: {
            unidadesProducto: response.data.map(up => ({ ...up, telas: dameTela(up) })),
            errorMsg: "",
          },
        };
      },
    },
    {
      type: "grape",
      name: "calcularProgreso",
    },
  ],
  calcularProgreso: [
    {
      type: "setStateKey",
      plug: (payload, { unidadesProducto }) => ({
        path: "progreso",
        value: unidadesProducto.reduce(
          (acum, actual) => ({
            total: acum.total + 1,
            cargadas: acum.cargadas + (actual.estado === "CARGADO" ? 1 : 0),
          }),
          { total: 0, cargadas: 0 },
        ),
      }),
    },
  ],
  onEnterPressed: [
    {
      type: "grape",
      name: "buscarUP"
    },
    {
      type: "function",
      function: payload => {
        document.getElementById("uP").value = "";
        document.getElementById("uP").focus();
      }
    }
  ],
  buscarUP: [
    {
      condition: (payload, { unidadesProducto }) => unidadesProducto.find(up => up.idunidad === payload.value),
      type: "grape",
      name: "marcarUP",
    },
    {
      condition: (payload, { unidadesProducto }) => !unidadesProducto.find(up => up.idunidad === payload.value),
      type: "grape",
      name: "errorUP",
    }
  ],
  errorUP: [
    {
      type: "showMessage",
      plug: (payload) => ({
        mensaje: `La unidad de producto ${payload.value} no se encuentra en esta Orden de Carga`,
        tipoMensaje: "error",
      }),
    }
  ],
  marcarUP: [
    {
      condition: (payload, { unidadesProducto }) => unidadesProducto.find(up => up.idunidad === payload.value).estado === "TERMINADO",
      type: "grape",
      name: "cargarUP",
    },
    {
      condition: (payload, { unidadesProducto }) => unidadesProducto.find(up => up.idunidad === payload.value).estado === "CARGADO",
      type: "grape",
      name: "retrocederUP",
    }
  ],
  cargarUP: [
    {
      type: "patch",
      schema: schemas.unidades_orden,
      action: "cargar_unidad",
      id: () => "-static-",
      data: ( payload ) => ({ unidad: payload.value }),
      success: "onCargarUnidadSuccess"
    }
  ],
  retrocederUP: [
    {
      type: "patch",
      schema: schemas.unidades_orden,
      action: "retroceder_unidad",
      id: () => "-static-",
      data: ( payload ) => ({ unidad: payload.value }),
      success: "onRetrocederUnidadSuccess"
    }
  ],
  onCargarUnidadSuccess: [
    {
      type: "setStateKey",
      plug: ( payload, { unidadesProducto } ) => {
        return { path: "unidadesProducto", value: unidadesProducto.map(up =>
        up.idunidad === payload.value
          ? { ...up, estado: "CARGADO", estadoant: "TERMINADO" }
          : up,
      ) }
      }
    },
    {
      type: "grape",
      name: "calcularProgreso",
    },
    {
      type: "showMessage",
      plug: (payload) => ({
        mensaje: `La unidad de producto ${payload.value} se ha cargado correctamente`,
        tipoMensaje: "success",
      }),
    }
  ],
  onRetrocederUnidadSuccess: [
    {
      type: "setStateKey",
      plug: ( payload, { unidadesProducto } ) => {
        return { path: "unidadesProducto", value: unidadesProducto.map(up =>
        up.idunidad === payload.value
          ? { ...up, estado: "TERMINADO", estadoant: "TERMINADO" }
          : up,
      ) }
      }
    },
    {
      type: "grape",
      name: "calcularProgreso",
    },
    {
      type: "showMessage",
      plug: (payload) => ({
        mensaje: `La unidad de producto ${payload.value} se ha desmarcado correctamente`,
        tipoMensaje: "success",
      }),
    }
  ],
  onTerminarClicked: [
    {
      type: "setStateKey",
      plug: (_p, { abrirDialogo }) => ({ path: "abrirDialogo", value: !abrirDialogo })
    },
  ],
  onConfirmarClicked: [
    {
      type: "patch",
      schema: schemas.ordenesCarga,
      id: (payload, {idOrdenDeCarga}) => idOrdenDeCarga,
      action: "completarDetalles",
      success: "onOrdenCargaTerminada"
    }
  ],
  onOrdenCargaTerminada: [
    {
      type: "setStateKeys",
      plug: (payload, { unidadesProducto }) => {
        const msg = "Todas las unidades de producto han sido cargadas correctamente";
        const abrirDialogo = false

        return {
          keys: {
            unidadesProducto: unidadesProducto.map(up =>
              up.estado === "TERMINADO" ? { ...up, estado: "CARGADO", estadoant: "TERMINADO" } : up),
            abrirDialogo
          }
        };
      },
    },
    {
      type: "grape",
      name: "calcularProgreso",
    },
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Todas las unidades de producto han sido cargadas correctamente",
        tipoMensaje: "success",
      }),
    }
  ],
  onCancelarClicked: [
    {
      type: "setStateKey",
      plug: (_p, { abrirDialogo }) => ({ path: "abrirDialogo", value: !abrirDialogo })
    },
  ]
});
