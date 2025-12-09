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
      schema: () => getSchemas().contactosAgente,
      action: "hoja_calculo",
      filter: (_, { filtro }) => {
        const and = [];
        if (filtro.codAgente) {
          and.push(["codagente", "eq", filtro.codAgente]);
        }
        if (filtro.fechaDesde) {
          and.push(["fechaaltacontacto", "gte", filtro.fechaDesde]);
        }
        if (filtro.fechaHasta) {
          and.push(["fechaaltacontacto", "lte", filtro.fechaHasta]);
        }

        return {
          and,
        };
      },
      fileName: () => "contactos_x_agente.xlsx",
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
