import { getSchemas, util } from "quimera";

export const state = parent => ({
  ...parent,
  filtro: {
    idAgente: null,
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
  onCargarDatosClicked: [
    {
      type: "download",
      schema: () => getSchemas().pedidosXAgente,
      action: "hoja_calculo",
      filter: (_, { filtro }) => {
        const and = [];
        if (filtro.idAgente) {
          and.push(["codagente", "eq", filtro.idAgente]);
        }
        if (filtro.fechaDesde) {
          and.push(["fecha", "gte", filtro.fechaDesde]);
        }
        if (filtro.fechaHasta) {
          and.push(["fecha", "lte", filtro.fechaHasta]);
        }

        return {
          and,
        };
      },
      fileName: () => "pedidos_x_agente.xlsx",
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
