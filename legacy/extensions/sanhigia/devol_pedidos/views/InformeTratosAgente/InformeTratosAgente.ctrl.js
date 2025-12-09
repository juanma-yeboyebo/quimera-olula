import { getSchemas, util } from "quimera";

export const state = parent => ({
  ...parent,
  filtro: {
    codAgente: null,
    intervaloFecha: null,
    fechaDesde: null,
    fechaHasta: null,
    estado: null,
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
      schema: () => getSchemas().tratosAgente,
      action: "hoja_calculo",
      filter: (_, { filtro }) => {
        const and = [];
        if (filtro.estado) {
          and.push(["estado", "eq", filtro.estado]);
        }
        if (filtro.idTipotrato) {
          and.push(["idtipotrato", "eq", filtro.idTipotrato]);
        }
        if (filtro.codAgente) {
          and.push(["codagente", "eq", filtro.codAgente]);
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
      fileName: () => "tratos_x_agente.xlsx",
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
