export const state = parent => ({
  ...parent,
  authenticated: false,
  // mensaje: '',
  // tipoMensaje: '',
  // objetoConfirm: null,
  // nombrePaginaActual: '',
  // vistaMovil: false,
});

export const bunch = parent => {
  return {
    setAuthenticated: [
      {
        log: () => ["SEET USER SATA AUTH"],
        type: "setStateKey",
        plug: ({ authenticated }) => ({
          path: "authenticated",
          value: authenticated,
        }),
      },
    ],

    // // onErrorProducido: [
    // //   {
    // //     type: "setStateKeys",
    // //     plug: ({ error }) => {
    // //       // const mensaje = (typeof error !== 'string' || !(error instanceof String)) ? 'Ha habido un error' : error
    // //       const mensaje = 'Ha habido un error'
    // //       return {
    // //         keys: { mensaje: mensaje, tipoMensaje: 'error' }
    // //       }
    // //     }
    // //   }
    // // ],
    // onErrorContainer: [
    //   {
    //     type: "grape",
    //     name: "onErrorProducido"
    //   }
    // ],
    // onError: [
    //   {
    //     type: "grape",
    //     name: "onErrorProducido"
    //   }
    // ],
    // onSnackbarAutoHide: [
    //   {
    //     log: ({ event, reason }) => ['HOLAAAAAAAA', event, reason],
    //     condition: ({ reason }) => reason !== 'clickaway',
    //     type: "setStateKeys",
    //     plug: () => ({
    //       keys: { mensaje: '', tipoMensaje: '' }
    //     })
    //   }
    // ]
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
