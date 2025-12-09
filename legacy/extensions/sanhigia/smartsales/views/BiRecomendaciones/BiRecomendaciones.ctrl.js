import { getSchemas } from "quimera";

export const state = parent => ({
  ...parent,
  data: null,
  filter: {},
});

export const bunch = parent => ({
  ...parent,
  onInit: [
    {
      type: "grape",
      name: "getGraphs",
    },
  ],
  getGraphs: [
    {
      condition: (_, { filter }) => !!filter?.and?.some(f => f[0] === "recom_codcliente"),
      type: "post",
      action: "get_bi_data",
      id: () => "-static-",
      data: (_, { filter }) => ({
        name: "recomendaciones_df",
        graphs: [
          {
            name: "RecomendacionesTree",
            data: "raw",
            serializer: {
              type: "tree",
              hierarchy: ["cli_nombre", "sf_descripcion", "recom_score"],
              title: "Recomendaciones",
              limit: 1000,
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
        value: value ?? {},
      }),
    },
    {
      type: "grape",
      name: "getGraphs",
    },
  ],
});
