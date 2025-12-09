import { getSchemas, util } from "quimera";

export const state = parent => ({
  ...parent,
  filtro: {
    idAgente: null,
    codSerie: null,
    codFamilia: null,
    codSubfamilia: null,
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
  onFiltroCodFamiliaChanged: [
    {
      type: "setStateKey",
      plug: ({ value }, { filtro }) => ({
        path: "filtro",
        value: {
          ...filtro,
          codFamilia: value,
          codSubfamilia: null,
        },
      }),
    },
  ],
  onLanzarInformeClicked: [
    {
      type: "download",
      schema: () => getSchemas().ventasArticulo,
      action: "lanzar",
      params: (_, { filtro }) => ({
        codagente: filtro.idAgente,
        codserie: filtro.codSerie,
        codfamilia: filtro.codFamilia,
        codsubfamilia: filtro.codSubfamilia,
        fechadesde: filtro.fechaDesde,
        fechahasta: filtro.fechaHasta,
      }),
      fileName: () => "ventas_articulo.pdf",
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
