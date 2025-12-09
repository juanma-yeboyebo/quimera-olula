import { ModelAPI, ModelCtrl } from "quimera/lib";

import schemas from "./DashboardStocks.schema";

export const state = parent => ({
  ...parent,
  stocks: ModelCtrl(schemas.stocks),
  cargandoDatos: true,
  stocksPedido: [],
  dialogo: {
    generandoPedido: false,
    pedidoCreado: false,
    titulo: "",
    cuerpo: "",
  },
  estadoCantidad: {
    error: false,
    texto: "",
  },
  checkoutVisible: false,
  cantidad: 0,
  cliente: "",
  direccion: 0,
  referencia: "",
  filtro: {
    estado: "",
    modelo: "",
    cantidad: 0,
    reftela: "",
  },
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "stocks",
    id: "id",
    schema: schemas.stocks,
    url: "/dashboardStocks",
  }),
  onInit: [
    {
      type: "setStateKey",
      plug: () => ({ path: "filtro.estado", value: "todos" }),
    },
    {
      type: "grape",
      name: "onFiltrarClicked",
    },
  ],
  onFiltrarClicked: [
    {
      type: "setStateKey",
      plug: (...[, { filtro }]) => ({
        path: "stocks.filter",
        value: {
          and: [
            ...(filtro.estado === "terminados" ? [["canterminadas", "gte", 1]] : []),
            ...(filtro.modelo ? [["modelo", "eq", filtro.modelo]] : []),
            ...(filtro.cantidad ? [["canstock", "gte", filtro.cantidad]] : []),
            ...(filtro.reftela ? [["reftela", "eq", filtro.reftela]] : []),
          ],
        },
      }),
    },
    {
      type: "grape",
      name: "getStocks",
    },
  ],
  onGetStocksSucceded: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "cargandoDatos", value: false }),
    },
  ],
  onIdStocksChanged: [
    {
      type: "setStateKey",
      plug: () => ({ path: "cantidad", value: 0 }),
    },
  ],
  onCantidadChanged: [
    {
      type: "setStateKeys",
      plug: (payload, { stocks, stocksPedido }) => {
        let cantPrevia = 0;
        const estadoCantidad = {
          error: false,
          texto: "",
        };
        if (stocksPedido?.some(s => s.id === stocks.current)) {
          cantPrevia = stocksPedido?.find(s => s.id === stocks.current)?.cantidad;
        }
        if (isNaN(payload.value) || payload.value === 0) {
          estadoCantidad.error = true;
          estadoCantidad.texto = "Cantidad no puede ser vacío o 0";
        } else if (stocks.dict[stocks.current].canstock < payload.value + cantPrevia) {
          estadoCantidad.error = true;
          estadoCantidad.texto = `El stock máximo es ${
            stocks.dict[stocks.current].canstock
          } unidad/es`;
        }

        // return { path: 'estadoCantidad', value: estadoCantidad }
        return { keys: { estadoCantidad, cantidad: payload.value } };
      },
    },
  ],
  onCantidadCarritoChanged: [
    {
      type: "setStateKey",
      plug: ({ index, value }, { stocksPedido }) => ({
        path: "stocksPedido",
        value: stocksPedido.map((stock, indice) =>
          indice === index ? { ...stock, cantidad: value } : stock,
        ),
      }),
    },
  ],
  onAgregarClicked: [
    {
      type: "setStateKeys",
      plug: (payload, { stocks, stocksPedido, cantidad }) => {
        let arrayStocks = [];
        if (stocksPedido.length === 0 || !stocksPedido.some(s => s.id === stocks.current)) {
          arrayStocks = [...stocksPedido, { ...stocks.dict[stocks.current], cantidad }];
        } else {
          arrayStocks = stocksPedido.map(s =>
            s.id === stocks.current ? { ...s, cantidad: s.cantidad + cantidad } : s,
          );
        }

        // return { keys: { stocksPedido: [...stocksPedido, { ...stocks.dict[stocks.current], cantidad: cantidad }], cantidad: 0 } }
        return { keys: { stocksPedido: arrayStocks, cantidad: 0 } };
      },
    },
  ],
  onAtrasClicked: [
    {
      type: "navigate",
      url: () => "/dashboardStocks",
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "stocks.current", value: null }),
    },
  ],
  onCheckoutClicked: [
    {
      type: "navigate",
      url: () => "/dashboardStocks",
    },
    {
      type: "setStateKeys",
      plug: (payload, state) => ({
        keys: { stocks: { ...state.stocks, current: null }, checkoutVisible: true },
      }),
    },
  ],
  onBorrarClicked: [
    {
      type: "setStateKey",
      plug: (payload, { stocksPedido }) => {
        stocksPedido.splice(payload.id, 1);

        return {
          path: "stocksPedido",
          value: stocksPedido,
        };
      },
    },
  ],
  onCrearPedidoClicked: [
    {
      type: "post",
      schema: schemas.pedidoscli,
      data: (...[, { stocksPedido, cliente, direccion, referencia }]) => ({
        codCliente: cliente,
        idDir: direccion,
        referencia,
        lineas: stocksPedido,
      }),
      id: () => "-static-",
      action: "crear_pedido",
      success: "onPedidoCreadoSucceded",
    },
    {
      type: "setStateKey",
      plug: (payload, state) => {
        const dialogo = {
          generandoPedido: true,
          titulo: "Generando Pedido",
          cuerpo: "Espere mientras generamos su pedido",
        };

        return {
          path: "dialogo",
          value: dialogo,
        };
      },
    },
  ],
  onPedidoCreadoSucceded: [
    {
      type: "setStateKey",
      plug: ({ response }, state) => {
        const dialogo = {
          generandoPedido: false,
          pedidoCreado: true,
          titulo: "Pedido generado correctamente",
          cuerpo: `Pedido ${response.data}`,
        };

        return {
          path: "dialogo",
          value: dialogo,
        };
      },
    },
  ],
  onConfirmarClicked: [
    {
      type: "setStateKeys",
      plug: (payload, state) => {
        const dialogo = {
          generandoPedido: false,
          pedidoCreado: false,
          titulo: "",
          cuerpo: "",
        };

        return {
          keys: {
            dialogo,
            checkoutVisible: false,
            stocksPedido: [],
            cantidad: 0,
            cliente: "",
            direccion: 0,
            referencia: "",
            cargandoDatos: true,
          },
        };
      },
    },
    {
      type: "grape",
      name: "getStocks",
    },
  ],
  onVolverClicked: [
    {
      type: "setStateKeys",
      plug: (payload, state) => ({
        keys: { checkoutVisible: false, direccion: 0, cliente: "", referencia: "" },
      }),
    },
  ],
});
