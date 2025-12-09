import { getSchemas, util } from "quimera";

export const state = parent => ({
  ...parent,
  filtro: {
    codAgente: null,
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
      schema: () => getSchemas().ventasPoblacion,
      action: "lanzar",
      params: (_, { filtro }) => ({
        codagente: filtro.codAgente,
        fechadesde: filtro.fechaDesde,
        fechahasta: filtro.fechaHasta,
      }),
      fileName: () => "ventas_poblacion.pdf",
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
