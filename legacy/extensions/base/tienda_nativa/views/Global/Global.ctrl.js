import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Global.ctrl.yaml";

// export const state = parent => ({
//   ...parent,
//   carrito: {
//     id: null,
//     lineas: []
//   }
// })

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
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
