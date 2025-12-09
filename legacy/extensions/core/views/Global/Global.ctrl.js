import { getMenus, util } from "quimera";
import { InnerDB } from "quimera/lib";

const UserDb = InnerDB.table("user_data");

export const state = parent => ({
  ...parent,
  mensaje: "",
  tipoMensaje: "",
  objetoConfirm: null,
  nombrePaginaActual: "",
  vistaMovil: false,
  authenticated: false,
  modalVisible: null,
});

export const bunch = parent => {
  return {
    onErrorProducido: [
      {
        type: "setStateKeys",
        plug: ({ error }) => {
          // const mensaje = (typeof error !== 'string' || !(error instanceof String)) ? 'Ha habido un error' : error
          const mensaje = "Ha habido un error";

          return {
            keys: { mensaje, tipoMensaje: "error" },
          };
        },
      },
    ],
    onErrorContainer: [
      {
        type: "grape",
        name: "onErrorProducido",
      },
    ],
    onError: [
      {
        type: "grape",
        name: "onErrorProducido",
      },
    ],
    onSnackbarAutoHide: [
      {
        condition: ({ reason }) => reason !== "clickaway",
        type: "setStateKeys",
        plug: () => ({
          keys: { mensaje: "", tipoMensaje: "" },
        }),
      },
    ],
    updateMenus: [
      {
        type: "setStateKey",
        plug: () => ({
          path: "menus",
          value: getMenus(),
        }),
      },
    ],
    mostrarMensaje: [
      {
        type: "setStateKeys",
        plug: ({ mensaje, tipoMensaje }) => ({
          keys: { mensaje, tipoMensaje },
        }),
      },
    ],
    onCerrarConfirm: [
      {
        type: "setStateKey",
        plug: ({ por }, { objetoConfirm }) => {
          por === "boton" && objetoConfirm.alDenegar && objetoConfirm.alDenegar();

          return { path: "objetoConfirm", value: null };
        },
      },
    ],
    onConfirmarConfirm: [
      {
        type: "function",
        function: (_, { objetoConfirm }) => {
          objetoConfirm.alConfirmar();
        },
      },
      {
        type: "grape",
        name: "onCerrarConfirm",
      },
    ],
    invocarConfirm: [
      {
        type: "setStateKey",
        plug: payload => ({
          path: "objetoConfirm",
          value: payload,
        }),
      },
    ],
    setNombrePaginaActual: [
      {
        type: "setStateKey",
        plug: payload => ({
          path: "nombrePaginaActual",
          value: payload.nombre,
        }),
      },
    ],
    setVistaMovil: [
      {
        type: "setStateKey",
        plug: payload => ({
          path: "vistaMovil",
          value: payload,
        }),
      },
    ],
    setAuthenticated: [
      {
        type: "setStateKey",
        plug: ({ authenticated }) => ({
          path: "authenticated",
          value: authenticated,
        }),
      },
    ],
    setUserData: [
      {
        type: "setStateKey",
        plug: ({ response }) => ({
          path: "user",
          value: response,
        }),
      },
      {
        type: "function",
        function: ({ response }) => {
          util.setUser(response);
          UserDb.updateRecord("user", response);
        },
      },
    ],
    setModalVisible: [
      {
        // log: payload => ["mimensaje_setModalVisible_2", payload],
        type: "setStateKey",
        plug: ({ name }) => ({
          path: "modalVisible",
          value: name,
        }),
      },
    ],
  };
};

export const ctrl = parent =>
  class core extends parent {
    // NOTIFICACION DE ERRORES o avisos COMUN \/
    // onSnackbarAutoHide(state, payload) {
    //   if (payload.reason === 'clickaway') {
    //     return state
    //   }
    //   return this.setState({
    //     ...state,
    //     mensaje: '',
    //     tipoMensaje: ''
    //   })
    // }
    // onErrorProducido(state, payload) {
    //   let error = payload.error
    //   if (typeof error !== 'string' || !(error instanceof String)) {
    //     error = 'Ha habido un error'
    //   }
    //   return this.setState({
    //     ...state,
    //     mensaje: error,
    //     tipoMensaje: 'error'
    //   })
    // }
    // onErrorContainer(state, payload) {
    //   return this.onErrorProducido(state, payload)
    // }
    // onError(state, payload) {
    //   return this.onErrorProducido(state, payload)
    // }
    // updateMenus(state, _payload) {
    //   return this.setState({
    //     ...state,
    //     menus: getMenus(),
    //   })
    // }
    // mostrarMensaje(state, payload) {
    //   return this.setState({
    //     ...state,
    //     mensaje: payload.mensaje,
    //     tipoMensaje: payload.tipoMensaje
    //   })
    // }
    // // MODAL DE CONFIRMACION COMUN \/
    // onCerrarConfirm(state, payload) {
    //   payload.por === 'boton' && state.objetoConfirm.alDenegar && state.objetoConfirm.alDenegar()
    //   return this.setState({
    //     ...state,
    //     objetoConfirm: null
    //   })
    // }
    // onConfirmarConfirm(state, payload) {
    //   state.objetoConfirm.alConfirmar(payload)
    //   return this.onCerrarConfirm(state, payload)
    // }
    // invocarConfirm(state, payload) {
    //   return this.setState({
    //     ...state,
    //     objetoConfirm: payload
    //   })
    // }
    // // NOMBRE PAGINA ACTUAL
    // setNombrePaginaActual(state, payload) {
    //   return this.setState({
    //     ...state,
    //     nombrePaginaActual: payload
    //   })
    // }
    // // TAMAÑO HEADER
    // setVistaMovil(state, payload) {
    //   return this.setState({
    //     ...state,
    //     vistaMovil: payload
    //   })
    // }
  };
