import { util } from "quimera";
import { MasterAPI, MasterCtrl } from "quimera/lib";

import schemas from "./DocumentosRepresentantes.schema";

export const state = parent => ({
  ...parent,
  documentos: MasterCtrl(schemas.documentos),
  data: {},
  list: false,
  carpetaActual: null,
  documentoSeleccionado: {},
  documentosBusqueda: [],
  buscando: false,
  textoBusqueda: "",
});

export const bunch = parent => ({
  ...parent,
  ...MasterAPI({
    name: "documentos",
    schema: schemas.documentos,
  }),
  onInit: [
    {
      type: "get",
      id: () => "-static-",
      schema: schemas.documentos,
      params: () => ({
        tipoobjeto: "gd_config",
        claveobjeto: "1",
      }),
      action: "dame_documentos",
      success: "onDocumentosRecibidos",
    },
  ],
  onDocumentosRecibidos: [
    {
      type: "setStateKeys",
      plug: ({ response }) => {
        const setPath = nodo => {
          for (let i = 0; i < nodo.children.length; i++) {
            const hijo = nodo.children[i];
            if (hijo.type === "dir") {
              hijo.pathText = [...nodo.pathText, hijo.name];
              hijo.pathId = [...nodo.pathId, hijo.id];
              setPath(hijo);
            }
          }
        };
        const arbol = {
          ...response,
          pathText: ["Documentos"],
          pathId: ["root"],
        };
        setPath(arbol);

        return { keys: { data: arbol, carpetaActual: arbol } };
      },
    },
  ],
  onDocumentoSeleccionado: [
    {
      type: "setStateKey",
      plug: payload => ({
        path: "documentoSeleccionado",
        value: {
          nombreDocumentoSeleccionado: payload.nombreDocumentoSeleccionado,
          idDocumentoSeleccion: payload.idDocumentoSeleccion,
        },
      }),
    },
  ],
  onDownloadClicked: [
    {
      condition: (_p, state) => !util.isEmptyObject(state.documentoSeleccionado),
      type: "download",
      schema: schemas.documentos,
      id: (_p, { documentoSeleccionado }) => documentoSeleccionado.idDocumentoSeleccion,
      pk: (payload, { documentoSeleccionado }) => documentoSeleccionado.idDocumentoSeleccion,
      action: "getFilesById",
      fileName: (_p, { documentoSeleccionado }) =>
        documentoSeleccionado.nombreDocumentoSeleccionado,
      params: (_p, { documentoSeleccionado }) => ({
        file: documentoSeleccionado.idDocumentoSeleccion,
        prefix: "documento",
      }),
    },
  ],
  onModoClicked: [
    {
      condition: (payload, state) => !state.buscando,
      type: "setStateKeys",
      plug: (payload, state) => ({
        keys: { documentoSeleccionado: {}, list: !state.list, buscando: false },
      }),
    },
    {
      condition: (payload, state) => state.buscando,
      type: "setStateKeys",
      plug: (payload, state) => ({
        keys: {
          documentoSeleccionado: {},
          textoBusqueda: "",
          documentosBusqueda: [],
          buscando: false,
        },
      }),
    },
  ],
  onCarpetaClicked: [
    {
      type: "setStateKeys",
      plug: (payload, state) => ({
        keys: { carpetaActual: payload.carpeta, documentoSeleccionado: {} },
      }),
    },
  ],
  onMigaClicked: [
    {
      type: "setStateKeys",
      plug: (payload, state) => {
        const dameCarpeta = (actual, id, raiz) => {
          let carpeta = actual;
          if (actual.id !== id) {
            if (id !== "root") {
              for (let i = 0; i < raiz.children.length; i++) {
                const hijo = raiz.children[i];
                if (hijo.type === "dir") {
                  if (hijo.id === id) {
                    return hijo;
                  }

                  carpeta = dameCarpeta(actual, id, hijo);
                }
              }
            } else {
              carpeta = raiz;
            }
          }

          return carpeta;
        };

        return {
          keys: {
            carpetaActual: dameCarpeta(state.carpetaActual, payload.id, state.data),
            documentoSeleccionado: {},
          },
        };
        // { path: 'carpetaActual', value: dameCarpeta(state.carpetaActual, payload, state.data) }
      },
    },
  ],
  onEnterPressed: [
    {
      condition: (payload, state) => state.textoBusqueda !== "",
      type: "setStateKeys",
      plug: (payload, state) => {
        const buscarDoc = (cadena, nodo, resultado) => {
          for (let i = 0; i < nodo.children.length; i++) {
            const hijo = nodo.children[i];
            if (hijo.type === "doc") {
              if (hijo.name.toLowerCase().includes(cadena.toLowerCase())) {
                resultado = [...resultado, hijo];
              }
            } else {
              resultado = buscarDoc(cadena, hijo, resultado);
            }
          }

          return resultado;
        };

        return {
          keys: {
            documentoSeleccionado: {},
            documentosBusqueda: buscarDoc(state.textoBusqueda, state.data, []),
            buscando: true,
          },
        };
      },
    },
  ],
  onBuscarClicked: [
    {
      condition: (payload, state) => state.textoBusqueda !== "",
      type: "setStateKeys",
      plug: (payload, state) => {
        const buscarDoc = (cadena, nodo, resultado) => {
          for (let i = 0; i < nodo.children.length; i++) {
            const hijo = nodo.children[i];
            if (hijo.type === "doc") {
              if (hijo.name.toLowerCase().includes(cadena.toLowerCase())) {
                resultado = [...resultado, hijo];
              }
            } else {
              resultado = buscarDoc(cadena, hijo, resultado);
            }
          }

          return resultado;
        };

        return {
          keys: {
            documentoSeleccionado: {},
            documentosBusqueda: buscarDoc(state.textoBusqueda, state.data, []),
            buscando: true,
          },
        };
      },
    },
  ],
  onBorrarBusquedaClicked: [
    {
      type: "setStateKeys",
      plug: () => ({
        keys: {
          documentoSeleccionado: {},
          textoBusqueda: "",
          documentosBusqueda: [],
          buscando: false,
        },
      }),
    },
  ],
});
