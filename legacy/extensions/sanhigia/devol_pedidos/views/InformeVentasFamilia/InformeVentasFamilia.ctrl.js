import { getSchemas, util } from "quimera";

export const state = parent => ({
  ...parent,
  filtro: {
    codAgente: null,
    codSerie: null,
    codCliente: null,
    intervaloFecha: null,
    fechaDesde: null,
    fechaHasta: null,
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
      schema: () => getSchemas().ventasFamilia,
      action: "lanzar",
      params: (_, { filtro }) => ({
        codagente: filtro.codAgente,
        codserie: filtro.codSerie,
        codcliente: filtro.codCliente,
        fechadesde: filtro.fechaDesde,
        fechahasta: filtro.fechaHasta,
      }),
      fileName: () => "ventas_familia.pdf",
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
