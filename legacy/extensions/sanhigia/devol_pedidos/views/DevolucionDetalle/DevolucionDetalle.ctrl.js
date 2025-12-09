import { getSchemas, util } from "quimera";
import { DetailAPI, DetailCtrl, MasterAPI, MasterCtrl } from "quimera/lib";
// import schemas from '../../static/schemas'

// schema (parecido a una tabla de db, pero en el cliente)
//   - id (entero)
//   - descripcion (texto)

// DetailCtrl(schema) = {
//   ...datos del esquema para un registro
//   id: null,
//   descripcion: ''
// }

// DetailAPI({
//   key (idPedido),
//   name (pedido),
//   schema,
//   validation
// })

// MasterCtrl(schema) = {
//   list: [],
//   page: {},
//   loading: bool,
//   filter: {},
//   order: {}
// }

// MasterAPI({
//   name: 'lineasDevolucion', // (nombre estado)
//   table: 'tdbLineas', // (nombre de la tabla en ui)
//   schema: getSchemas().lineasDevolucion,
//   action: '',
// })

// get a la api, con filtro, orden, paginacion....
// siguiente (onNext)
// filterChanged (filtros)
// columnClicked (orden)

export const state = parent => ({
  ...parent,
  idPedido: "",
  callbackCerrado: null,
  pedido: DetailCtrl(getSchemas().pedidos),
  lineasDevolucion: MasterCtrl(getSchemas().lineasDevolucion),
  validacionLineasDevolucion: [],
  esComercial: true,
  procesandoDevolucion: false,
});

export const bunch = parent => ({
  ...parent,
  ...DetailAPI({
    key: "idPedido",
    name: "pedido",
    schema: getSchemas().pedidos,
  }),
  ...MasterAPI({
    name: "lineasDevolucion",
    table: "tdbLineas",
    schema: getSchemas().lineasDevolucion,
    action: "get_lotes_devolucion",
  }),
  onInit: [
    {
      type: "setStateKeys",
      plug: ({ idPedido, callbackCerrado }) => ({
        keys: {
          idPedido,
          callbackCerrado,
          esComercial: !["000002", "000004", "000006"].includes(util.getUser()?.grupo),
        },
      }),
    },
    {
      condition: (_payload, { idPedido }) => !!idPedido,
      type: "grape",
      name: "getPedido",
    },
  ],
  onGetPedidoSucceded: [
    {
      condition: (_payload, { pedido }) => !!pedido.idPedido,
      type: "grape",
      name: "getLineasDevolucion",
    },
  ],
  onCantidadOkChanged: [
    {
      type: "grape",
      name: "onCantidadesDevolChanged",
    },
  ],
  onCantidadKoChanged: [
    {
      type: "grape",
      name: "onCantidadesDevolChanged",
    },
  ],
  onCantidadesDevolChanged: [
    {
      type: "setStateKeys",
      plug: ({ field, value, index }, { lineasDevolucion }) => ({
        keys: {
          lineasDevolucion: {
            ...lineasDevolucion,
            list: [
              ...lineasDevolucion.list.slice(0, index),
              {
                ...lineasDevolucion.list[index],
                [field]: value,
              },
              ...lineasDevolucion.list.slice(index + 1),
            ],
          },
        },
      }),
    },
    {
      type: "setStateKeys",
      plug: ({ index }, { lineasDevolucion, validacionLineasDevolucion }) => ({
        keys: {
          validacionLineasDevolucion: [
            ...lineasDevolucion.list.map((linea, idx) => ({
              ...(validacionLineasDevolucion?.[idx] ?? {}),
              ...(linea.id === lineasDevolucion.list[index].id
                ? {
                  cantidadOk: getSchemas().lineasDevolucion.validation(
                    {
                      lista: lineasDevolucion.list,
                      linea,
                    },
                    "cantidadOk",
                  ),
                  cantidadKo: getSchemas().lineasDevolucion.validation(
                    {
                      lista: lineasDevolucion.list,
                      linea,
                    },
                    "cantidadKo",
                  ),
                }
                : {}),
            })),
          ],
        },
      }),
    },
  ],
  onLimpiarCantidadesClicked: [
    {
      type: "grape",
      name: "onCantidadesDevolChanged",
      plug: ({ data }) => ({ field: "cantidadOk", value: 0.0, index: data.index }),
    },
    {
      type: "grape",
      name: "onCantidadesDevolChanged",
      plug: ({ data }) => ({ field: "cantidadKo", value: 0.0, index: data.index }),
    },
  ],
  onPrepararDevolucionClicked: [
    {
      type: "userConfirm",
      question: () => ({
        titulo: "Se va a preparar la devolución ¿Está seguro?",
        cuerpo: "",
        textoSi: "CONFIRMAR",
        textoNo: "CANCELAR",
      }),
      onConfirm: "onPrepararDevolucionConfirmed",
    },
  ],
  onPrepararDevolucionConfirmed: [
    {
      type: "setStateKey",
      plug: () => ({ path: "procesandoDevolucion", value: true }),
    },
    {
      type: "post",
      schema: getSchemas().preparadoDevolucion,
      data: (_p, { lineasDevolucion }) => lineasDevolucion.list,
      action: "preparar_devolucion",
      success: "onDevolucionPreparadaSuccess",
      error: "onDevolucionPreparadaError",
    },
  ],
  onDevolucionPreparadaSuccess: [
    {
      type: "setStateKey",
      plug: () => ({ path: "procesandoDevolucion", value: false }),
    },
    {
      type: "function",
      function: (_p, { callbackCerrado }) => callbackCerrado(),
    },
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Se ha preparado la devolución correctamente",
        tipoMensaje: "success",
      }),
    },
  ],
  onDevolucionPreparadaError: [
    {
      type: "setStateKey",
      plug: () => ({ path: "procesandoDevolucion", value: false }),
    },
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Ha ocurrido un error al preparar la devolución. Contacte con soporte.",
        tipoMensaje: "error",
      }),
    },
  ],
});
