import { getSchemas } from "quimera";

export const state = parent => ({
  ...parent,
  data: [],
  filter: {
    fechaInicio: null,
    fechaFin: null,
    codFamilia: null,
    codSubfamilia: null,
  },
  descFamilia: null,
});

export const bunch = parent => ({
  ...parent,
  onInit: [
    {
      type: "grape",
      name: "getData",
    },
  ],
  getData: [
    {
      type: "get",
      schema: (_, { filter }) =>
        filter.codFamilia ? getSchemas().subfamilia : getSchemas().familia,
      id: () => "-static-",
      action: "get_by_facturacion",
      params: (_, { filter }) => ({
        codfamilia: filter.codFamilia ?? null,
      }),
      filter: (_, { filter }) => (filter.codFamilia ? ["codfamilia", "eq", filter.codFamilia] : []),
      page: () => ({
        limit: 100,
      }),
      success: "onDataRecieved",
    },
  ],
  onDataRecieved: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({
        path: "data",
        value: response.data,
      }),
    },
  ],
  onFilterFechaInicioChanged: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "filter.fechaInicio", value }),
    },
  ],
  onFilterFechaFinChanged: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "filter.fechaFin", value }),
    },
  ],
  onFamiliaChanged: [
    {
      type: "setStateKey",
      plug: ({ item }) => ({
        path: "filter.codFamilia",
        value: item.codigo,
      }),
    },
    {
      type: "setStateKey",
      plug: ({ item }) => ({
        path: "descFamilia",
        value: item.descripcion,
      }),
    },
    {
      type: "grape",
      name: "getData",
    },
  ],
  onGoBackClicked: [
    {
      type: "setStateKey",
      plug: () => ({
        path: "filter.codFamilia",
        value: null,
      }),
    },
    {
      type: "setStateKey",
      plug: () => ({
        path: "descFamilia",
        value: null,
      }),
    },
    {
      type: "grape",
      name: "getData",
    },
  ],
});
