import { getSchemas } from "quimera";

export const state = parent => ({
  ...parent,
  poblaciones: null,
  data: null,
  filter: {},
  limit: 5,
  offset: 0,
});

export const bunch = parent => ({
  ...parent,
  getInitialData: [
    {
      type: "post",
      action: "get_bi_data",
      id: () => "-static-",
      data: (_, { filter }) => ({
        name: "ventas_df",
        graphs: [
          {
            name: "VentasPorPoblacion",
            data: "pvptotal_by_poblacion",
            serializer: {
              type: "json",
            },
          },
        ],
        filter,
      }),
      schema: () => getSchemas().graficos,
      success: "onGetInitialDataSucceeded",
    },
  ],
  onGetInitialDataSucceeded: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({
        path: "poblaciones",
        value: response.data,
      }),
    },
    {
      type: "grape",
      name: "getGraphs",
      plug: () => ({ next: false }),
    },
  ],
  getGraphs: [
    {
      type: "post",
      action: "get_bi_data",
      id: () => "-static-",
      data: (_, { poblaciones, filter, offset, limit }) => ({
        name: "ventas_df",
        graphs:
          poblaciones?.VentasPorPoblacion?.slice(offset, offset + limit).map(
            ({ cp_poblacion }, idx) => ({
              name: `${idx} ${cp_poblacion}`,
              data: "diff_pvptotal_by_subfamilia_anyo",
              individualFilter: { and: [["cp_poblacion", "eq", cp_poblacion]] },
              serializer: {
                type: "waterfall",
                total: "fact_fecha_year",
                relative: "sfam_descripcion",
                value: "lfact_total",
              },
            }),
          ) ?? [],
        filter,
      }),
      schema: () => getSchemas().graficos,
      success: "onGetGraphsSucceeded",
    },
  ],
  onGetGraphsSucceeded: [
    {
      type: "setStateKey",
      plug: ({ response, next }, { data }) => ({
        path: "data",
        value: { ...(next ? data : {}), ...response.data },
      }),
    },
  ],
  onFilterChanged: [
    {
      type: "setStateKeys",
      plug: ({ value }) => ({
        keys: {
          filter: value ?? {},
        },
      }),
    },
    {
      type: "grape",
      name: "resetOffset",
    },
    {
      type: "grape",
      name: "getInitialData",
    },
  ],
  resetOffset: [
    {
      type: "setStateKey",
      plug: () => ({
        path: "offset",
        value: 0,
      }),
    },
  ],
  // prevOffset: [
  //   {
  //     type: 'setStateKey',
  //     plug: (_, { offset, limit }) => ({
  //       path: 'offset',
  //       value: offset >= limit ? offset - limit : 0,
  //     }),
  //   },
  //   {
  //     type: 'grape',
  //     name: 'getGraphs',
  //   },
  // ],
  onNextOffsetClicked: [
    {
      type: "setStateKey",
      plug: (_, { poblaciones, offset, limit }) => ({
        path: "offset",
        value:
          offset + limit - 1 < (poblaciones?.VentasPorPoblacion?.length ?? 0)
            ? offset + limit
            : offset,
      }),
    },
    {
      type: "grape",
      name: "getGraphs",
      plug: () => ({ next: true }),
    },
  ],
});
