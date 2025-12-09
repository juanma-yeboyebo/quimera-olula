import { getSchemas } from "quimera";

export const state = parent => ({
  ...parent,
  data: null,
  filter: { and: [] },
  cluster: "cluster_fam",
});

export const bunch = parent => ({
  ...parent,
  getGraphs: [
    {
      type: "post",
      action: "get_bi_data",
      id: () => "-static-",
      data: (_, { filter, cluster }) => ({
        name: "ventas_df",
        graphs: [
          {
            name: "SegmentosGeoMap",
            data: "clusters_by_segmento",
            serializer: {
              type: "dot_map",
              longitud: "geo_longitud",
              latitud: "geo_latitud",
              color: cluster,
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
        value: value ?? { and: [] },
      }),
    },
    {
      type: "grape",
      name: "getGraphs",
    },
  ],
  onClusterChanged: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({
        path: "cluster",
        value,
      }),
    },
    {
      type: "grape",
      name: "getGraphs",
    },
  ],
});
