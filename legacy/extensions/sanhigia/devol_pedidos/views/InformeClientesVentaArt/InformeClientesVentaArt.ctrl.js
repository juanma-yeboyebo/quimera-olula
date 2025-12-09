import { getSchemas, util } from "quimera";

export const state = parent => ({
  ...parent,
  filtro: {
    idAgente: null,
    referencia: null,
    intervaloFecha: null,
    fechaDesde: null,
    fechaHasta: null,
    codFamilia: null
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
      log: (_, { filtro }) => ["milog", filtro],
      type: "download",
      schema: () => getSchemas().clientesVentaArt,
      action: "lanzar",
      params: (_, { filtro }) => ({
        codagente: filtro.idAgente,
        fechadesde: filtro.fechaDesde,
        fechahasta: filtro.fechaHasta,
        referencias: JSON.stringify([filtro.referencia]),
        codfamilia: filtro.codFamilia,
        codsubfamilia: filtro.codSubfamilia
      }),
      fileName: () => "ventas_articulo_cliente.pdf",
    },
  ],
  onTestSucceded: [
    {
      log: () => "Fin",
      type: "void",
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
