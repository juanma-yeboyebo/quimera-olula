import { getSchemas } from "quimera";

import chartdata from "./chartdata";

export const state = parent => ({
  ...parent,
  dataHistoricoPrevision: chartdata.dataHistoricoPrevision,
  layoutHistoricoPrevision: chartdata.layoutHistoricoPrevision,
  filter: {
    fechaInicio: null,
    fechaFin: null,
    codFamilia: null,
    codSubfamilia: null,
  },
});

export const bunch = parent => ({
  ...parent,
  onInit: [
    {
      type: "setStateKey",
      plug: payload => ({ path: "filter", value: payload }),
    },
    {
      type: "grape",
      name: "getHistoricoPrevisionData",
    },
  ],
  getHistoricoPrevisionData: [
    {
      type: "get",
      schema: getSchemas().graficoHistoricoPrevision,
      id: () => "-static-",
      params: (_, { filter }) => ({
        fecha_inicio: filter.fechaInicio,
        fecha_fin: filter.fechaFin,
        familia: filter.codFamilia,
        subfamilia: filter.codSubfamilia,
      }),
      action: "get_historico_prevision",
      success: "onHistoricoPrevisionRecieved",
    },
  ],
  onHistoricoPrevisionRecieved: [
    {
      type: "setStateKey",
      plug: ({ response }, { dataHistoricoPrevision }) => ({
        path: "dataHistoricoPrevision",
        value: dataHistoricoPrevision.map((item, idx) => ({
          ...item,
          x: response.x_axis,
          y: response.y_axis[idx],
        })),
      }),
    },
  ],
});
