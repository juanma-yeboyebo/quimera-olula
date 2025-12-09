import { getSchemas, util } from "quimera";

export const state = parent => ({
  ...parent,
  filtro: {
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
      schema: () => getSchemas().consumoCliente,
      action: "lanzar",
      params: (_, { filtro }) => ({
        codcliente: filtro.codCliente,
        fechadesde: filtro.fechaDesde,
        fechahasta: filtro.fechaHasta,
      }),
      fileName: () => "consumo_cliente.pdf",
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
