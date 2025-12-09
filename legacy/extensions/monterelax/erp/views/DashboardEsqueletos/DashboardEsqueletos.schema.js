// import { util } from 'quimera'

const esqBase = {
  name: "mx_stockscomponentes",
  key: "id",
  page: { limit: 1000 },
  load: apiData => apiData,
  dump: uiData => uiData,
};

export default {
  historico: {
    ...esqBase,
  },
  cola: {
    ...esqBase,
  },
};
