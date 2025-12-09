import { getSchemas, util } from "quimera";

export const state = parent => ({
  ...parent,
  filtro: {
    codCliente: null,
    idAgente: null,
    intervaloFecha: null,
    fechaDesde: null,
    fechaHasta: null,
    servido: null,
    solopdtes: false,
    solodisponibles: false,
  },
});

export const bunch = parent => ({
  ...parent,
  onInit: [
    {
      type: "setStateKeys",
      plug: payload => ({
        keys: {
          ...payload,
        },
      }),
    },
  ],
  onAtrasClicked: [
    {
      type: "function",
      function: () => window.history.back(),
    },
  ],
  onLanzarInformeClicked: [
    {
      type: "download",
      schema: () => getSchemas().ventasPedidosSan,
      action: "lanzar",
      params: (_, { filtro }) => ({
        codagente: filtro.codAgente,
        codcliente: filtro.codCliente,
        codserie: filtro.codSerie,
        servido: filtro.servido,
        fechadesde: filtro.fechaDesde,
        fechahasta: filtro.fechaHasta,
        solopdtes: filtro.solopdtes,
        solodisponibles: filtro.solodisponibles,
      }),
      fileName: () => "ventas_pedidos.pdf",
    },
  ],
  onFiltroSolopdtesClicked: [
    {
      type: "setStateKey",
      plug: (_, { filtro }) => ({ path: "filtro.solopdtes", value: !filtro.solopdtes }),
    },
  ],
  onFiltroSolodisponiblesClicked: [
    {
      type: "setStateKey",
      plug: (_, { filtro }) => ({ path: "filtro.solodisponibles", value: !filtro.solodisponibles }),
    },
  ],
  onFiltroIntervaloFechaChanged: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "filtro.intervaloFecha", value }),
    },
    {
      condition: ({ value }) => !!value,
      type: "setStateKeys",
      plug: ({ value }) => ({
        path: "filtro",
        keys: {
          fechaDesde: util.intervalos[value]?.desde(),
          fechaHasta: util.intervalos[value]?.hasta(),
        },
      }),
    },
  ],
});
