import { API } from "quimera/lib";

export const state = parent => ({
  ...parent,
  csvFile: null,
  hasHeader: true,
  delimiter: ",",
  errors: [],
  dispatch: null,
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
  onUploadFileClicked: [
    {
      type: "setStateKeys",
      plug: () => ({
        keys: {
          errors: [],
        },
      }),
    },
    {
      condition: (_, { csvFile }) => !!csvFile,
      type: "function",
      function: (_, { csvFile, hasHeader, delimiter, dispatch }) => {
        API("dataload")
          .post(
            {
              hasHeader,
              delimiter,
            },
            "upload_historico_ventas",
          )
          .setFiles(csvFile)
          .go("onDataLoad", dispatch);
      },
    },
  ],
  onDataLoad: [
    {
      condition: ({ error }) => !!error,
      type: "setStateKey",
      plug: ({ errors }) => ({ path: "errors", value: errors }),
    },
    {
      condition: ({ error }) => !error,
      type: "showMessage",
      plug: () => ({
        mensaje: "Fichero cargado con éxito.",
        tipoMensaje: "success",
      }),
    },
  ],
});
