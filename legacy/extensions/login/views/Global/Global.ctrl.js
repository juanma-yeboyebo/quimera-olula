import { util } from "quimera";

// import data from './Global.ctrl.json'

// export const state = parent => ({
//   ...parent,
//   carrito: {
//     id: null,
//     lineas: []
//   }
// })

export const state = parent => ({
  ...parent,
  // ...shortcutsState(data.shortcuts),
  // ...data.state
});

export const bunch = parent => {
  // const parentConShortCuts = {
  //   ...parent,
  //   ...shortcutsBunch(data.shortcuts)
  // }
  return {
    ...parent,
    // ...parentConShortCuts,
    // ...applyBunch(data.bunch, parentConShortCuts),
    onLogout: [
      {
        type: "function",
        function: () => {
          util.setGlobalSetting("user", null);
          for (let i = 0; i < window.localStorage.length; i++) {
            /// QUITAR EN PRODUCCION, AHORA ES COMPATIBLE Y DIFERENCIA USUARIOS
            if (window.localStorage.key(i).includes("filtro")) {
              window.localStorage.removeItem(window.localStorage.key(i));
            }
          }
          window.location.reload();
        },
      },
    ],
  };
};

export const ctrl = parent =>
  class core extends parent {
    // NOTIFICACION DE ERRORES o avisos COMUN \/
    // setCarrito(state, payload) {
    //   const esquemaCarrito = getSchemas().carrito
    //   const carrito = esquemaCarrito.load(payload.carrito)
    //   return this.setState({
    //     ...state,
    //     carrito: {
    //       ...state.carrito,
    //       ...carrito
    //     }
    //   })
    // }
  };
