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
            name: "VentasAnyoSubfamilia",
            data: "diff_pvptotal_by_subfamilia_anyo",
            serializer: {
              type: "waterfall",
              total: "fact_fecha_year",
              relative: "sfam_descripcion",
              value: "lfact_total",
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
