import { util } from "quimera";
import { DetailAPI, DetailCtrl, ModelAPI, ModelCtrl } from "quimera/lib";

import { TpvDb } from "../../lib";
import schemas from "../../static/schemas";

const getTicketData = ({ response }, { ventas }) => {
  const data = getData({ response }, { ventas });

  return data;
};

const getData = ({ response }, { ventas }) => [
  {
    ...schemas.ticketEmpresa.load(
      Object.keys(response)
        .filter(k => k.startsWith("empresa"))
        .reduce((accum, k) => ({ ...accum, [k]: response[k] }), {}),
    ),
    ...schemas.ticketVenta.load({
      ...ventas.dict[ventas.current],
      pv: response,
    }),
    ...schemas.ticketTienda.load(
      Object.keys(response)
        .filter(k => k.startsWith("tienda"))
        .reduce((accum, k) => ({ ...accum, [k]: response[k] }), {}),
    ),
    lineas_ticket_tpv: ventas.dict[ventas.current].lineas.map(l => schemas.ticketLineas.load(l)),
    iva_ticket_tpv: Object.values(
      ventas.dict[ventas.current].lineas.reduce(
        (accum, item) => ({
          ...accum,
          [item.iva]: {
            poriva: item.iva,
            pvpbase: (accum[item.iva]?.pvpbase ?? 0) + item.pvpTotal / (1 + (item.iva ?? 0) / 100),
            pvptotaliva: (accum[item.iva]?.pvptotaliva ?? 0) + item.pvpTotal,
            cuotaiva:
              (accum[item.iva]?.cuotaiva ?? 0) +
              item.pvpTotal -
              item.pvpTotal / (1 + (item.iva ?? 0) / 100),
          },
        }),
        {},
      ),
    ),
    pagos_ticket_tpv: ventas.dict[ventas.current].pagos.map(p => schemas.ticketPagos.load(p)),
  },
];

export const state = parent => ({
  ...parent,
  ventas: ModelCtrl(schemas.ventas),
  lineas: ModelCtrl(schemas.lineas),
  pagos: ModelCtrl(schemas.pagos),
  catalogo: ModelCtrl(schemas.catalogo),
  ventasBuffer: {},
  lineasBuffer: {},
  nuevaLinea: DetailCtrl(schemas.lineas),
  pagosBuffer: DetailCtrl(schemas.pagos),
  pagando: false,
  entregado: 0,
  cargarCatalogoVisible: false,
  estadoBotonCarga: false,
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "ventas",
    id: "id",
    schema: schemas.ventas,
    url: "/tpv",
  }),
  ...ModelAPI({
    name: "lineas",
    id: "idLinea",
    schema: schemas.lineas,
  }),
  ...ModelAPI({
    name: "pagos",
    id: "idPago",
    schema: schemas.pagos,
  }),
  ...ModelAPI({
    name: "catalogo",
    id: "referencia",
    schema: schemas.catalogo,
    action: "get_catalogo",
  }),
  ...DetailAPI({
    name: "nuevaLinea",
    id: "idLinea",
    schema: schemas.lineas,
  }),
  ...DetailAPI({
    name: "pagosBuffer",
    id: "idPago",
    schema: schemas.pagos,
  }),
  onInit: [
    {
      type: "grape",
      name: "getVentas",
    },
  ],
  onAtrasClicked: [
    {
      type: "navigate",
      url: () => "/tpv",
    },
    {
      type: "setStateKeys",
      plug: () => ({
        keys: {
          "ventas.current": null,
          "pagando": false,
        },
      }),
    },
  ],
  getVentas: [
    {
      type: "function",
      function: () => TpvDb.getVentas(),
      success: [
        {
          type: "setStateKey",
          plug: ({ response }, { ventas }) => ({
            path: "ventas",
            value: {
              ...ventas,
              idList: response ? Object.keys(response).map(key => parseInt(key)) : [],
              dict: response ?? {},
            },
          }),
        },
        {
          type: "grape",
          name: "onGetVentasSucceded",
        },
      ],
    },
  ],
  onIdVentasChanged: [
    {
      condition: (_, { ventas, ventasBuffer }) =>
        !TpvDb.ventaExist(ventas.current) && !ventasBuffer.id,
      type: "navigate",
      url: () => "/tpv",
    },
    {
      condition: (_payload, { ventas }) => ventas.current,
      type: "grape",
      name: "getLineas",
    },
    {
      condition: (_payload, { ventas }) => ventas.current,
      type: "grape",
      name: "getPagos",
    },
    {
      type: "grape",
      name: "cargaBufferVenta",
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "pagando", value: false }),
    },
  ],
  onGetVentasSucceded: [
    {
      type: "grape",
      name: "cargaBufferVenta",
    },
  ],
  cargaBufferVenta: [
    {
      condition: (_payload, { ventas }) => ventas.current,
      type: "setStateKey",
      plug: (_payload, { ventas }) => ({
        path: "ventasBuffer",
        value: { ...ventas.dict[ventas.current] },
      }),
    },
  ],
  cargaBufferLinea: [
    {
      condition: (_payload, { lineas }) => lineas.current,
      type: "setStateKey",
      plug: (_payload, { lineas }) => ({
        path: "lineasBuffer",
        value: { ...lineas.dict[lineas.current] },
      }),
    },
  ],
  getLineas: [
    {
      condition: (_payload, { ventas }) => ventas.current,
      type: "setStateKey",
      plug: (_payload, { lineas, ventas }) => ({
        path: "lineas",
        value: {
          ...lineas,
          idList: ventas.dict[ventas.current]?.lineas?.map(linea => linea.idLinea) ?? [],
          dict:
            ventas.dict[ventas.current]?.lineas?.reduce(
              (accum, item) => ({ ...accum, [item.idLinea]: item }),
              {},
            ) ?? {},
          current: null,
        },
      }),
    },
  ],
  getPagos: [
    {
      condition: (_payload, { ventas }) => ventas.current,
      type: "setStateKey",
      plug: (_payload, { pagos, ventas }) => ({
        path: "pagos",
        value: {
          ...pagos,
          idList: ventas.dict[ventas.current]?.pagos.map(pago => pago.idPago),
          dict: ventas.dict[ventas.current]?.pagos.reduce(
            (accum, item) => ({ ...accum, [item.idPago]: item }),
            {},
          ),
          current: null,
        },
      }),
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "pagosBuffer", value: schemas.pagos.load({}) }),
    },
  ],
  onLineasClicked: [
    {
      type: "setStateKey",
      plug: payload => ({ path: "lineas.current", value: payload.item.idLinea }),
    },
    {
      type: "grape",
      name: "cargaBufferLinea",
    },
  ],
  recalcularVenta: [
    {
      type: "function",
      function: (_payload, { ventas }) => ({
        neto: ventas.dict[ventas.current].lineas.reduce(
          (accum, linea) => accum + linea.pvpTotal / (1 + (linea.iva ?? 0) / 100),
          0,
        ),
        total: ventas.dict[ventas.current].lineas.reduce(
          (accum, linea) => accum + linea.pvpTotal,
          0,
        ),
      }),
      success: [
        {
          type: "setStateKey",
          plug: ({ response }, { ventas }) => ({
            path: `ventas.dict.${ventas.current}`,
            value: {
              ...ventas.dict[ventas.current],
              neto: response.neto,
              totalIva: response.total - response.neto,
              total: response.total,
              pendiente: response.total - ventas.dict[ventas.current].pagado,
            },
          }),
        },
      ],
    },
  ],
  onGuardarLinea: [
    {
      type: "grape",
      name: "recalcularLinea",
    },
    {
      condition: (_, { ventas }) => !ventas.dict[ventas.current].cerrada,
      type: "setStateKey",
      plug: (_payload, { lineas, ventas }) => ({
        path: `ventas.dict.${ventas.current}`,
        value: { ...ventas.dict[ventas.current], lineas: Object.values(lineas.dict) },
      }),
    },
    {
      type: "grape",
      name: "recalcularVenta",
    },
    {
      type: "grape",
      name: "onGuardarVentaClicked",
    },
  ],
  onGuardarPagos: [
    {
      condition: (_, { ventas }) => ventas.dict[ventas.current].codigo === "nueva",
      type: "setStateKey",
      plug: (_, { ventas }) => ({
        path: `ventas.dict.${ventas.current}.codigo`,
        value: TpvDb.getNextCodigo(),
      }),
    },
    {
      type: "setStateKey",
      plug: (_payload, { ventas, pagos }) => ({
        path: `ventas.dict.${ventas.current}`,
        value: { ...ventas.dict[ventas.current], pagos: Object.values(pagos.dict) },
      }),
    },
    {
      type: "function",
      function: (_payload, { ventas }) => ({
        nuevaCantidad: ventas.dict[ventas.current].pagos.reduce(
          (accum, pago) => accum + pago.importe,
          0,
        ),
      }),
      success: [
        {
          type: "setStateKey",
          plug: ({ response }, { ventas }) => ({
            path: `ventas.dict.${ventas.current}`,
            value: { ...ventas.dict[ventas.current], pagado: response.nuevaCantidad },
          }),
        },
      ],
    },
    {
      type: "setStateKey",
      plug: (_, { entregado }) => ({ path: "entregado", value: 0 }),
    },
    {
      type: "grape",
      name: "recalcularVenta",
    },
    {
      type: "grape",
      name: "onGuardarVentaClicked",
    },
  ],
  recalcularLinea: [
    {
      condition: (_payload, { lineas, ventas }) =>
        lineas.current && !ventas.dict[ventas.current].cerrada,
      type: "function",
      function: (_payload, { lineas }) => ({
        linea: lineas.dict[lineas.current],
        pvpSinDto: lineas.dict[lineas.current].cantidad * lineas.dict[lineas.current].pvpUnitario,
      }),
      success: [
        {
          type: "setStateKey",
          plug: ({ response }, { lineas }) => ({
            path: "lineas.dict",
            value: {
              ...lineas.dict,
              [lineas.current]: {
                ...response.linea,
                pvpSinDto: response.pvpSinDto,
                pvpTotal:
                  response.pvpSinDto -
                  (response.linea.dtoLineal ?? 0) -
                  response.pvpSinDto * ((response.linea.dtoPor ?? 0) / 100),
              },
            },
          }),
        },
      ],
    },
  ],
  onVentasBufferCodClienteChanged: [
    {
      type: "setStateKey",
      plug: ({ option }, { ventasBuffer }) => ({
        path: "ventasBuffer",
        value: {
          ...ventasBuffer,
          codCliente: option?.codCliente,
          cifNif: option?.cifNif,
          nombreCliente: option?.nombre,
          codDir: null,
        },
      }),
    },
  ],
  onVentaSeccionConfirmada: [
    {
      type: "setStateKey",
      plug: (_, { ventasBuffer, ventas }) => ({
        path: `ventas.dict.${ventas.current}`,
        value: {
          ...ventas.dict[ventas.current],
          codCliente: ventasBuffer.codCliente,
          codDir: ventasBuffer.codDir,
          nombreCliente: ventasBuffer.nombreCliente,
          cifNif: ventasBuffer.cifNif,
        },
      }),
    },
    {
      condition: ({ onSuccess }) => !!onSuccess,
      type: "function",
      function: ({ onSuccess }) => onSuccess && onSuccess(),
    },
    {
      type: "grape",
      name: "onGuardarVentaClicked",
    },
  ],
  onLineaSeccionConfirmada: [
    {
      type: "setStateKey",
      plug: ({ fields }, { lineas, lineasBuffer }) => ({
        path: "lineas.dict",
        value: {
          ...lineas.dict,
          [lineas.current]: fields.reduce(
            (accum, item) => ({ ...accum, [item]: lineasBuffer[item] }),
            lineas.dict[lineas.current],
          ),
        },
      }),
    },
    {
      condition: ({ onSuccess }) => !!onSuccess,
      type: "function",
      function: ({ onSuccess }) => onSuccess && onSuccess(),
    },
    {
      type: "grape",
      name: "onGuardarLinea",
    },
  ],
  onLineaSeccionCancelada: [
    {
      type: "setStateKey",
      plug: ({ fields }, { lineas, lineasBuffer }) => ({
        path: "lineasBuffer",
        value: {
          ...lineasBuffer,
          ...fields.reduce(
            (accum, item) => ({ ...accum, [item]: lineas.dict[lineas.current][item] }),
            lineasBuffer,
          ),
        },
      }),
    },
  ],
  onLineaArticuloSeccionConfirmada: [
    {
      type: "grape",
      name: "onLineaSeccionConfirmada",
      plug: payload => ({
        ...payload,
        fields: ["referencia", "descripcion", "pvpUnitario", "iva", "codImpuesto"],
      }),
    },
  ],
  onLineaDescuentoSeccionConfirmada: [
    {
      type: "grape",
      name: "onLineaSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["dtoLineal", "dtoPor"] }),
    },
  ],
  onLineaImpuestoSeccionConfirmada: [
    {
      type: "grape",
      name: "onLineaSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["codImpuesto", "iva", "recargo", "irpf"] }),
    },
  ],
  onLineaArticuloSeccionCancelada: [
    {
      type: "grape",
      name: "onLineaSeccionCancelada",
      plug: () => ({ fields: ["referencia", "descripcion", "pvpUnitario", "iva", "codImpuesto"] }),
    },
  ],
  onLineaDescuentoSeccionCancelada: [
    {
      type: "grape",
      name: "onLineaSeccionCancelada",
      plug: () => ({ fields: ["dtoLineal", "dtoPor"] }),
    },
  ],
  onLineaImpuestoSeccionCancelada: [
    {
      type: "grape",
      name: "onLineaSeccionCancelada",
      plug: () => ({ fields: ["codImpuesto", "iva", "recargo", "irpf"] }),
    },
  ],
  onGuardarVentaClicked: [
    // {
    //   type: 'setStateKey',
    //   plug: (_payload, { ventas, ventasBuffer }) => ({ path: 'ventas.dict', value: ({ ...ventas.dict, [ventas.current]: { ...ventas.dict[ventas.current], ...ventasBuffer } }) })
    // },
    {
      type: "function",
      function: (_payload, { ventas }) => util.setGlobalSetting("ventas_tpv", ventas.dict),
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "pagosBuffer", value: schemas.pagos.load({}) }),
    },
    {
      type: "grape",
      name: "cargaBufferVenta",
    },
  ],
  onLineasBufferReferenciaChanged: [
    {
      condition: (_, { ventas }) => !ventas.dict[ventas.current].cerrada,
      type: "setStateKey",
      plug: ({ option, value }, { lineasBuffer }) => ({
        path: "lineasBuffer",
        value: {
          ...lineasBuffer,
          referencia: value ? option.referencia : null,
          descripcion: value ? option.descripcion : null,
          pvpUnitario: value ? option.pvp : null,
          iva: value ? option.iva : null,
          codImpuesto: value ? option.codImpuesto : null,
        },
      }),
    },
    {
      type: "grape",
      name: "recalcularLinea",
    },
  ],
  onLineasBufferCantidadChanged: [
    {
      type: "grape",
      name: "onCantidadPvpChanged",
      plug: payload => payload,
    },
  ],
  onLineasBufferPvpUnitarioChanged: [
    {
      type: "grape",
      name: "onCantidadPvpChanged",
      plug: payload => payload,
    },
  ],
  onCantidadPvpChanged: [
    {
      type: "setStateKey",
      plug: ({ field, value }, { lineasBuffer }) => ({
        path: "lineasBuffer",
        value: { ...lineasBuffer, [field.split(".")[1]]: value },
      }),
    },
    {
      type: "grape",
      name: "onLineaSeccionConfirmada",
      plug: () => ({ fields: ["cantidad", "pvpUnitario"] }),
    },
  ],
  onNuevaLinea: [
    {
      condition: (_payload, { nuevaLinea }) => !!nuevaLinea.referencia && !!nuevaLinea.cantidad,
      type: "function",
      function: (_payload, { lineas }) => ({
        idNuevaLinea: lineas.idList.length ? Math.max(...lineas.idList) + 1 : 1,
      }),
      success: [
        {
          type: "setStateKey",
          plug: ({ response }, { nuevaLinea, lineas, ventas }) => ({
            path: "lineas",
            value: {
              ...lineas,
              idList: [...lineas.idList, response.idNuevaLinea],
              dict: {
                ...lineas.dict,
                [response.idNuevaLinea]: {
                  ...nuevaLinea,
                  idLinea: response.idNuevaLinea,
                  idVenta: ventas.current,
                },
              },
              current: response.idNuevaLinea,
            },
          }),
        },
        {
          type: "setStateKey",
          plug: () => ({ path: "nuevaLinea", value: schemas.lineas.load({}) }),
        },
        {
          type: "grape",
          name: "onGuardarLinea",
        },
      ],
    },
  ],
  onNuevaLineaReferenciaChanged: [
    {
      type: "setStateKey",
      plug: ({ option, value }, { nuevaLinea }) => ({
        path: "nuevaLinea",
        value: {
          ...nuevaLinea,
          referencia: value ? option.referencia : null,
          descripcion: value ? option.descripcion : null,
          pvpUnitario: value ? option.pvp : null,
          iva: value ? option.iva : null,
          codImpuesto: value ? option.codImpuesto : null,
        },
      }),
    },
  ],
  onEliminarLineaSeccionConfirmada: [
    {
      condition: (_, { ventas }) => !ventas.dict[ventas.current].cerrada,
      type: "function",
      function: (_payload, { lineas }) => ({
        indexLinea: lineas.idList.indexOf(lineas.current),
        listLength: lineas.idList.length,
      }),
      success: [
        {
          type: "setStateKey",
          plug: ({ response }, { lineas }) => ({
            path: "lineas",
            value: {
              ...lineas,
              idList: lineas.idList.filter(idLinea => idLinea !== lineas.current),
              dict: Object.values(lineas.dict)
                .filter(linea => linea.idLinea !== lineas.current)
                .reduce((accum, linea) => ({ ...accum, [linea.idLinea]: linea }), {}),
              current:
                response.listLength > response.indexLinea + 1
                  ? lineas.idList[response.indexLinea + 1]
                  : response.listLength
                    ? lineas.idList[response.indexLinea - 1]
                    : null,
            },
          }),
        },
        {
          type: "grape",
          name: "cargaBufferLinea",
        },
        {
          type: "grape",
          name: "onGuardarLinea",
        },
      ],
    },
  ],
  onNuevaVentaClicked: [
    {
      type: "function",
      function: (_payload, { ventas }) => ({
        idNuevaVenta: ventas.idList.length ? Math.max(...ventas.idList) + 1 : 1,
      }),
      success: [
        {
          type: "setStateKey",
          plug: ({ response }, { ventas }) => ({
            path: "ventas",
            value: {
              ...ventas,
              idList: [...ventas.idList, response.idNuevaVenta],
              dict: {
                ...ventas.dict,
                [response.idNuevaVenta]: {
                  ...schemas.ventas.load({}),
                  id: response.idNuevaVenta,
                },
              },
              current: null,
            },
          }),
        },
        {
          type: "grape",
          name: "onVentasClicked",
          plug: ({ response }) => ({ item: { id: response.idNuevaVenta } }),
        },
      ],
    },
  ],
  onPagarVentaClicked: [
    {
      type: "setStateKey",
      plug: () => ({ path: "pagando", value: true }),
    },
    {
      type: "setStateKey",
      plug: (_, { ventas }) => ({
        path: "pagosBuffer.importe",
        value: ventas.dict[ventas.current].pendiente,
      }),
    },
  ],
  onCancelarPagoClicked: [
    {
      type: "setStateKey",
      plug: () => ({ path: "pagando", value: false }),
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "pagosBuffer", value: schemas.pagos.load({}) }),
    },
    {
      type: "setStateKey",
      plug: (_, { entregado }) => ({ path: "entregado", value: 0 }),
    },
  ],
  onConfirmarPagoClicked: [
    {
      type: "function",
      function: (_, { entregado, ventasBuffer }) => ({
        pagar: entregado > ventasBuffer.pendiente ? ventasBuffer.pendiente : entregado,
      }),
      success: [
        {
          type: "setStateKey",
          plug: ({ response }, { entregado }) => ({
            path: "pagosBuffer.importe",
            value: response.pagar,
          }),
        },
      ],
    },
    {
      type: "function",
      function: (_payload, { pagos }) => ({
        idNuevoPago: pagos.idList.length ? Math.max(...pagos.idList) + 1 : 1,
      }),
      success: [
        {
          type: "setStateKey",
          plug: ({ response }, { pagosBuffer, ventas }) => ({
            path: "pagosBuffer",
            value: {
              ...pagosBuffer,
              idPago: response.idNuevoPago,
              idVenta: ventas.current,
              importe: pagosBuffer.importe,
              formaPago: pagosBuffer.formaPago,
            },
          }),
        },
        {
          type: "setStateKey",
          plug: ({ response }, { pagosBuffer, pagos, ventas }) => ({
            path: "pagos",
            value: {
              ...pagos,
              idList: [...pagos.idList, response.idNuevoPago],
              dict: { ...pagos.dict, [response.idNuevoPago]: pagosBuffer },
              current: response.idNuevoPago,
            },
          }),
        },
        {
          // Actualizo el pagado de la venta
          type: "setStateKey",
          plug: (_, { ventasBuffer, pagosBuffer }) => ({
            path: "ventasBuffer",
            value: {
              ...ventasBuffer,
              pagado: pagosBuffer.importe + ventasBuffer.pagado,
            },
          }),
        },
        {
          condition: (_payload, { ventasBuffer }) => ventasBuffer.pagado === ventasBuffer.total,
          type: "setStateKey",
          plug: (_, { ventas }) => ({ path: `ventas.dict.${ventas.current}.cerrada`, value: true }),
        },
        {
          type: "grape",
          name: "onGuardarPagos",
        },
        {
          type: "setStateKey",
          plug: () => ({ path: "pagando", value: false }),
        },
        {
          condition: (_payload, { ventas }) => ventas.dict[ventas.current].cerrada,
          type: "grape",
          name: "onImprimirVentaClicked",
        },
      ],
    },
  ],
  onEliminarPagoClicked: [
    {
      type: "setStateKey",
      plug: ({ id }, { pagos }) => ({
        path: "pagos",
        value: {
          ...pagos,
          idList: pagos.idList.filter(idPago => idPago !== id),
          dict: Object.values(pagos.dict)
            .filter(pago => pago.idPago !== id)
            .reduce((accum, pago) => ({ ...accum, [pago.idPago]: pago }), {}),
          current:
            pagos.idList.length > id + 1
              ? pagos.idList[id + 1]
              : pagos.idList.length
                ? pagos.idList[id - 1]
                : null,
        },
      }),
    },
    {
      condition: (_, { ventas }) => ventas.dict[ventas.current].cerrada,
      type: "setStateKey",
      plug: (_, { ventasBuffer }) => ({
        path: `ventas.dict.${ventas.current}.cerrada`,
        value: false,
      }),
    },
    {
      type: "grape",
      name: "onGuardarPagos",
    },
  ],
  onPagoContadoClicked: [
    {
      type: "setStateKey",
      plug: () => ({ path: "pagosBuffer.formaPago", value: "CONT" }),
    },
  ],
  onPagoTarjetaClicked: [
    {
      type: "setStateKey",
      plug: () => ({ path: "pagosBuffer.formaPago", value: "TARJ" }),
    },
    {
      type: "setStateKeys",
      plug: (_, { ventasBuffer }) => ({
        keys: {
          "pagosBuffer.formaPago": "TARJ",
          "entregado": ventasBuffer.pendiente,
        },
      }),
    },
  ],
  onCantidadClicked: [
    {
      type: "setStateKey",
      plug: (payload, { entregado }) => ({ path: "entregado", value: entregado + payload.item }),
    },
  ],
  onLimpiarEntregadoClicked: [
    {
      type: "setStateKey",
      plug: () => ({ path: "entregado", value: 0 }),
    },
  ],
  onSyncVentas: [
    {
      type: "setStateKey",
      plug: ({ ventasSincro }, { ventas }) => ({
        path: "ventas.dict",
        value: {
          ...ventas.dict,
          ...ventasSincro,
        },
      }),
    },
  ],
  onCargarCatalogoClicked: [
    {
      type: "setStateKey",
      plug: () => ({ path: "cargarCatalogoVisible", value: true }),
    },
  ],
  onCargarArticulosClicked: [
    {
      type: "setStateKey",
      plug: () => ({ path: "estadoBotonCarga", value: true }),
    },
    {
      type: "grape",
      name: "getCatalogo",
    },
  ],
  onGetCatalogoSucceded: [
    {
      type: "function",
      function: (_, { catalogo }) =>
        TpvDb.cargarCatalogo({
          fechaCarga: `${util.today()} ${util.now()}`,
          articulos: catalogo.dict,
        }),
    },
    {
      type: "patch",
      schema: schemas.puntosventa,
      id: () => TpvDb.getPuntoVenta()?.puntoventa?.codigo,
      data: () => ({ fechaultcargacatalogo: `${util.today()} ${util.now()}` }),
      success: [
        {
          type: "setStateKey",
          plug: () => ({ path: "estadoBotonCarga", value: false }),
        },
        {
          type: "showMessage",
          plug: () => ({ mensaje: "Catálogo cargado con éxito.", tipoMensaje: "success" }),
        },
      ],
      error: [
        {
          type: "showMessage",
          plug: () => ({
            mensaje: "Ha surgido un error en la carga del catálogo.",
            tipoMensaje: "error",
          }),
        },
      ],
    },
  ],
  onCargarCatalogoSeccionCerrada: [
    {
      type: "setStateKey",
      plug: () => ({ path: "cargarCatalogoVisible", value: false }),
    },
  ],
  onImprimirVentaClicked: [
    {
      type: "function",
      function: () => TpvDb.getPuntoVenta().puntoventa,
      success: [
        {
          condition: ({ response }) =>
            !!response.printerUrl && !!response.printerAlias && !!response.ticketReportAlias,
          type: "print",
          printerUrl: ({ response }) => response.printerUrl,
          printerAlias: ({ response }) => response.printerAlias,
          reportAlias: ({ response }) => response.ticketReportAlias,
          data: getTicketData,
          success: [
            {
              type: "showMessage",
              plug: () => ({ mensaje: "Ticket impreso correctamente", tipoMensaje: "success" }),
            },
          ],
          error: [
            {
              log: payload => payload,
              type: "showMessage",
              plug: () => ({ mensaje: "Hubo un error durante la impresión", tipoMensaje: "error" }),
            },
          ],
        },
      ],
    },
  ],
});
