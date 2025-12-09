import { getSchemas } from "quimera";

export const state = parent => ({
  ...parent,
  data: null,
  filter: {},
  hola: 2,
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
            name: "VentasAgenteFamiliaBar",
            data: "pvptotal_by_familia_agente",
            serializer: {
              type: "stackedbar",
              group: "fact_agente",
              stack: "art_codfamilia",
              group_label: "agt_nombre",
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
