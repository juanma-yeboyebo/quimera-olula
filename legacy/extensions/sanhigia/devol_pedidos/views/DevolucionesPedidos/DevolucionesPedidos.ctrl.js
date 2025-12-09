import { getSchemas, util } from "quimera";
// import { navigate } from 'quimera'

export const state = parent => ({
  ...parent,
  pedidoscli: [],
  modalBuscarFacturaVisible: false,
  modalDevolucionVisible: false,
  idFactura: null,
  razonDevolucion: "",
  idPedido: "",
  filtroBuscarFactura: { and: [] },
  objetoFacturaRecibida: {},
  cabeceraFacturas: {},
  lineas: [],
  objetoDevolucion: {},
  totalDevoluciones: 0,
  ordenDevoluciones: {
    field: "fecha",
    direction: "DESC",
  },
  filtro: null,
  indicadorCargando: false,
  filtroDev: null,
});

export const bunch = parent => ({
  ...parent,
  onIdFacturaChanged: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "idFactura", value }),
    },
  ],
  init: [
    {
      type: "grape",
      name: "cargarDevolucionesPedidos",
    },
  ],
  cargarDevolucionesPedidos: [
    {
      type: "setStateKey",
      plug: (payload, state) => {
        const { ordenDevoluciones, filtro } = state;
        let filtroDev = payload.filtro || filtro;
        const codAgente = util.getUser().codagente;
        const grupo = util.getUser().grupo;
        const filtroCuentas = {
          and: [
            ["idfacturarec", "gt", 0],
            ["editable", "eq", true],
            ["sh_estadopago", "neq", "''"],
          ],
        };
        if (!(grupo === "000002" || grupo === "000004" || grupo === "000006")) {
          filtroCuentas.and.push(["codagente", "eq", codAgente]);
        }
        if (filtroDev) {
          const filtroAPoner = Array.isArray(filtroDev.and) ? filtroDev.and : filtroDev;
          Array.isArray(filtroAPoner) && filtroAPoner.forEach(f => filtroCuentas.and.push(f));
        }
        filtroDev = filtroCuentas;

        return { path: "filtroDev", value: filtroDev };
      },
    },
    {
      type: "get",
      schema: () => getSchemas().devolPedidos,
      filter: (_, { filtroDev }) => filtroDev,
      page: () => {
        50;
      },
      order: (payload, { ordenDevoluciones }) => {
        console.log("ORDENES ", payload.orden, ordenDevoluciones);
        const ordenDev = payload.orden || ordenDevoluciones;

        return ordenDev;
      },
      success: "onDatosRecibidos",
    },
    {
      type: "get",
      id: () => "static",
      action: "total_devoluciones",
      schema: () => getSchemas().devolPedidos,
      filter: (_, { filtroDev }) => filtroDev,
      success: "onTotalDevolucionesCargadas",
    },
  ],
  onDatosRecibidos: [
    {
      type: "setStateKey",
      plug: ({ response }, state) => ({ path: "pedidoscli", value: response.data }),
    },
  ],
  onTotalDevolucionesCargadas: [
    {
      type: "setStateKey",
      plug: ({ response }, state) => ({
        path: "totalDevoluciones",
        value: response.totaldevoluciones,
      }),
    },
  ],
  onTdbPedidoscliRowClicked: [
    {
      type: "setStateKeys",
      plug: payload => {
        return { keys: { idPedido: payload.id, modalDevolucionVisible: true } };
      },
    },
  ],
  onCerrarDevolucionDetalle: [
    {
      type: "setStateKeys",
      plug: payload => {
        return { keys: { idPedido: "", modalDevolucionVisible: false, objetoDevolucion: {} } };
      },
    },
  ],
  onCerrarBuscarFactura: [
    {
      type: "setStateKeys",
      plug: payload => {
        return {
          keys: {
            idFactura: null,
            modalBuscarFacturaVisible: false,
            objetoFacturaRecibida: {},
            lineas: [],
          },
        };
      },
    },
  ],
  onDynamicFilterDevolucionesPedidoChanged: [
    {
      type: "setStateKey",
      plug: (payload, state) => ({ path: "filtro", value: payload.value }),
    },
    {
      type: "grape",
      name: "cargarDevolucionesPedidos",
    },
  ],
  onBuscarFacturaClicked: [
    {
      type: "grape",
      name: "generarFiltro",
    },
  ],
  generarFiltro: [
    {
      type: "setStateKeys",
      plug: (payload, state) => {
        const codAgente = util.getUser().codagente;
        const grupo = util.getUser().grupo;
        let filtroP = {};
        if (grupo === "000004") {
          filtroP = {};
        } else {
          filtroP = {
            and: [["codagente", "eq", `'${codAgente}'`]],
          };
        }

        return { keys: { filtroBuscarFactura: filtroP, modalBuscarFacturaVisible: true } };
      },
    },
  ],
  onBuscarFacturaObtenidaClicked: [
    {
      type: "get",
      id: () => "static",
      action: "dame_objeto_factura",
      schema: () => getSchemas().devolFacturas,
      filter: (_, { idFactura }) => {
        const filtroFactura = {
          idfactura: idFactura,
        };
        console.log("filtrofactura", filtroFactura);

        return filtroFactura;
      },
      success: "onBuscarFacturaRecibida",
    },
  ],
  onBuscarFacturaRecibida: [
    {
      type: "setStateKeys",
      plug: ({ response }) => {
        console.log("onBuscarFacturaRecibida", response);

        return {
          keys: {
            objetoFacturaRecibida: response,
            cabeceraFactura: response.cabecera,
            lineas: response.lineas,
          },
        };
      },
    },
  ],
  onCantidadDevolverCambia: [
    {
      type: "setStateKey",
      plug: (payload, { lineas }) => {
        const lineasFactura = lineas;
        lineasFactura.forEach(linea => {
          if (linea.idlinea === payload.idlinea) {
            linea.cantidadDevolver = payload.blur
              ? parseFloat(payload.nuevaCantidadDevolver) || 0
              : payload.nuevaCantidadDevolver;
          }
        });

        return { path: "lineas", value: lineasFactura };
      },
    },
  ],
  onCantidadDevolverCambiada: [
    {
      type: "setStateKey",
      plug: (payload, { lineas }) => {
        const lineasFactura = lineas;
        lineasFactura.forEach(linea => {
          if (linea.idlinea === payload.idlinea) {
            if (
              Math.abs(parseFloat(linea.cantidad)) <
                Math.abs(parseFloat(payload.nuevaCantidadDevolver)) &&
              payload.nuevaCantidadDevolver !== 0
            ) {
              linea.cantidadDevolver = linea.cantidad;
              util.getSetting("appDispatch")({
                type: "mostrarMensaje",
                payload: {
                  mensaje: "No puedes devolver mas cantidad que la presente en la factura",
                  tipoMensaje: "error",
                },
              });
            } else {
              linea.cantidadDevolver = payload.blur
                ? parseFloat(payload.nuevaCantidadDevolver) || 0
                : payload.nuevaCantidadDevolver;
            }
          }
        });

        return { path: "lineas", value: lineasFactura };
      },
    },
  ],
  onActualizarCantidadDevolverClicked: [
    {
      type: "setStateKey",
      plug: (payload, { lineas }) => {
        const lineasFactura = lineas;
        lineasFactura.forEach(linea => {
          if (linea.idlinea === payload.idlinea) {
            linea.cantidadDevolver = linea.cantidad;
          }
        });

        return { path: "lineas", value: lineasFactura };
      },
    },
  ],
  onActualizarTodasCantidadesDevolverClicked: [
    {
      type: "setStateKey",
      plug: (payload, { lineas }) => {
        const lineasFactura = lineas;
        lineasFactura.forEach(linea => {
          if (!linea.esKit) {
            linea.cantidadDevolver = linea.cantidad;
          }
        });

        return { path: "lineas", value: lineasFactura };
      },
    },
  ],
  onCrearDevolucionClicked: [
    {
      type: "setStateKey",
      plug: (payload, state) => ({ path: "indicadorCargando", value: true }),
    },
    {
      type: "post",
      schema: () => getSchemas().crearPedidoDevolucion,
      data: (_, { lineas, idFactura, razonDevolucion }) => ({
        idFactura,
        razonDevolucion,
        lineasConDevoluciones: JSON.stringify(lineas.filter(linea => linea.cantidadDevolver > 0)),
      }),
      id: () => "-static-",
      action: "crear_devolucion",
      success: "onDevolucionCreadaSuccess",
    },
  ],
  onDevolucionCreadaSuccess: [
    {
      type: "appDispatch",
      name: "mostrarMensaje",
      plug: (payload, state) => ({
        mensaje: `Se ha generado la devolución ${payload.response.codigo}`,
        tipoMensaje: "success",
      }),
    },
    {
      type: "setStateKeys",
      plug: payload => {
        return {
          keys: {
            modalDevolucionVisible: false,
            modalBuscarFacturaVisible: false,
            idFactura: null,
            lineas: [],
            indicadorCargando: false,
          },
        };
      },
    },
  ],
  onTdbPedidoscliColumnClicked: [
    {
      condition: (payload, state) => payload.data.order,
      type: "grape",
      name: "calculaOrdenDevoluciones",
    },
    {
      condition: (payload, state) => payload.data.order,
      type: "grape",
      name: "cargarDevolucionesPedidos",
    },
  ],
  calculaOrdenDevoluciones: [
    {
      type: "setStateKey",
      plug: (payload, { ordenDevoluciones }) => {
        const ordenDevolucionesActual = ordenDevoluciones;
        let direction = "ASC";
        if (payload.data.order === ordenDevolucionesActual.field) {
          direction = ordenDevolucionesActual.direction === "ASC" ? "DESC" : "ASC";
        }
        const ordenDevolucionesFinal = {
          field: payload.data.order,
          direction,
        };

        return { path: "ordenDevoluciones", value: ordenDevolucionesFinal };
      },
    },
  ],
});
