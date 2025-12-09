import { getSchemas } from "quimera";

export const state = parent => ({
  ...parent,
  filtro: {
    incluirYaCaducados: false,
    meses: null,
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
  onLanzarInformeClicked: [
    {
      type: "download",
      schema: () => getSchemas().articulos,
      action: "informe_productos_caducar",
      params: (_, { filtro }) => ({
        incluirYaCaducados: filtro.incluirYaCaducados,
        meses: filtro.meses,
      }),
      fileName: () => "productos_a_caducar.xlsx",
    },
  ],
});
