import { getSchemas } from "quimera";

export const state = parent => ({
  ...parent,
  data: null,
  filter: {},
});

export const bunch = parent => ({
  ...parent,
  getGraphs: [
    {
      type: "post",
      action: "get_bi_data",
      id: () => "-static-",
      data: (_, { filter }) => ({
        name: "ventas_df",
        graphs: [
          {
            name: "VentasComunidadFamiliaBar",
            data: "pvptotal_by_familia_comunidad",
            serializer: {
              type: "stackedbar",
              group: "ca_idcomunidad",
              stack: "art_codfamilia",
              group_label: "ca_nombrecomunidad",
              stack_label: "fam_descripcion",
              value: "lfact_total",
            },
          },
          {
            name: "VentasSubfamiliaTreemap",
            data: "pvptotal_by_subfamilia",
            serializer: {
              type: "treemap",
              parent: "fam_descripcion",
              child: "sfam_descripcion",
              value: "lfact_total",
            },
          },
          {
            name: "VentasGeoMap",
            data: "pvptotal_by_geo",
            serializer: {
              type: "dot_map",
              longitud: "geo_longitud",
              latitud: "geo_latitud",
              size: "lfact_total",
            },
          },
        ],
        filter,
      }),
      schema: () => getSchemas().graficos,
      success: "onGetGraphsSucceeded",
    },
  ],
  onGetGraphsSucceeded: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({
        path: "data",
        value: response.data,
      }),
    },
  ],
  onFilterChanged: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({
        path: "filter",
        value,
      }),
    },
    {
      type: "grape",
      name: "getGraphs",
    },
  ],
});
