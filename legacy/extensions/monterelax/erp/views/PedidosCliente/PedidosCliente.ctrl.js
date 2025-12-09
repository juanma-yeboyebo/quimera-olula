import { ModelAPI, ModelCtrl } from "quimera/lib";

import schemas from "./PedidosCliente.schema";

export const state = parent => ({
  ...parent,
  pedidos: ModelCtrl(schemas.pedidoscli),
  lineas: ModelCtrl(schemas.lineaspedido),
  lineasAlbaran: ModelCtrl(schemas.lineasalbaran),
  albaranes: [],
  indiceTab: 0,
  item: {},
  filtro: {
    estado: "",
    cliente: "",
    pedido: "",
  },
  filtroReferencia: false,
  filtroServidos: false
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "pedidos",
    id: "idPedido",
    schema: schemas.pedidoscli,
    url: "/pedidosCliente",
  }),
  ...ModelAPI({
    name: "lineas",
    id: "idLinea",
    schema: schemas.lineaspedido,
  }),
  ...ModelAPI({
    name: "lineasAlbaran",
    id: "idlinea",
    schema: schemas.lineasalbaran,
  }),
  onInit: [
    {
      type: "grape",
      name: "onFiltrarClicked",
    }
  ],
  onFiltrarClicked: [
    {
      type: "setStateKey",
      plug: (...[, { filtro, filtroServidos }]) => ({
        path: "pedidos.filter",
        value: {
          and: [
            // ...(!filtro.estado && !filtro.cliente && !filtro.pedido
            //   ? [["estado", "not_in", ["CARGADO"]]]
            //   : []),
            ...(filtro.estado === "pendiente" ? [["estado", "eq", "PTE"]] : []),
            ...(filtro.estado === "terminado" ? [["estado", "eq", "TERMINADO"]] : []),
            ...(filtro.estado === "cargado" ? [["estado", "eq", "CARGADO"]] : []),
            ...(filtro.estado === "produccion"
              ? [["estado", "in", ["CORTADO", "EN COSIDO", "COSIDO", "MONTADO"]]]
              : []),
            ...(filtro.cliente ? [["codcliente", "eq", filtro.cliente]] : []),
            ...(filtro.pedido ? [["referencia", "eq", filtro.pedido]] : []),
            ...(filtroServidos ? [["servido", "in", ["Sí", "No", "Parcial"]]] : [["servido", "in", ["No", "Parcial"]]]),
          ],
        },
      }),
    },
    {
      type: "grape",
      name: "getPedidos",
    },
  ],
  onCurrentPedidosItemChanged: [
    {
      condition: (...[, { pedidos }]) => !!pedidos.idList.length,
      type: "setStateKeys",
      plug: (payload, { lineas }) => {
        console.log("onItemSelected", payload.item);

        return {
          keys: {
            indiceTab: 0,
            lineas: {
              ...lineas,
              dict: {},
              idList: [],
              current: null,
            },
          },
        };
      },
    },
  ],
  onSwitchReferenciaClicked: [
    {
      type: "setStateKeys",
      plug: (_, { filtroReferencia }) => ({
        keys: {
          filtroReferencia: !filtroReferencia,
          filtroServidos: false,
          filtro: {
            estado: "",
            cliente: "",
            pedido: "",
          },
        },
      }),
    },
    {
      type: "grape",
      name: "onFiltrarClicked",
    }
  ],
  onSwitchServidosClicked: [
    {
      type: "setStateKeys",
      plug: (_, { filtroServidos }) => ({
        keys: {
          filtroReferencia: false,
          filtroServidos: !filtroServidos,
        },
      }),
    },
    {
      type: "grape",
      name: "onFiltrarClicked",
    }
  ],
  onTabSelected: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "indiceTab", value }),
    },
    {
      condition: ({ value }) => value === 1,
      type: "grape",
      name: "getLineas",
    },
    {
      condition: ({ value }) => value === 2,
      type: "grape",
      name: "getLineasAlbaran",
    },
  ],
  onAtrasClicked: [
    {
      type: "navigate",
      url: () => "/pedidosCliente",
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "pedidos.current", value: null }),
    },
  ],
  onReclamarClicked: [
    {
      type: "patch",
      schema: schemas.pedidoscli,
      key: ({ idpedido }) => idpedido,
      data: () => ({ reclamado: true }),
      success: "onReclamarSuccess",
    },
  ],
  onReclamarSuccess: [
    {
      type: "showMessage",
      plug: ({ codigo }) => ({ mensaje: `Pedido ${codigo} reclamado`, tipoMensaje: "success" }),
    },
    {
      type: "setStateKey",
      plug: ({ idpedido }) => ({
        path: `pedidos.dict.${idpedido}.reclamado`,
        value: true,
      }),
    },
  ],
  onGetLineasAlbaranSucceded: [
    {
      type: "post",
      schema: schemas.albarancli,
      id: () => "-static-",
      action: "dame_albaran",
      data: (payload, { lineasAlbaran }) => ({ lineas: lineasAlbaran }),
      success: "onGetAlbaranesSucceded",
    },
  ],
  onGetAlbaranesSucceded: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({ path: "albaranes", value: response.data }),
    },
  ],
  onDescargarAlbaranClicked: [
    {
      type: "download",
      schema: schemas.pedidoscli,
      id: ({ albaran }) => albaran.codigo,
      action: "getAlbaran",
      fileName: ({ albaran }) => `${albaran.codigo}.pdf`,
      params: ({ albaran }) => ({ file: albaran.codigo }),
    },
  ],
});
