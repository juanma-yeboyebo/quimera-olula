import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./DatosConsumidor.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  consumidor: {
    idConsumidor: null,
    nombre: "",
    apellidos: "",
    telefono: "",
    email: "",
    idUsuario: null,
    genero: "",
  },
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onConsumidorBufferChanged: [
      {
        type: "setStateKey",
        plug: payload => ({
          path: `consumidor.buffer.${payload.field}`,
          value: payload.value ?? 0,
        }),
      },
      {
        type: "grape",
        name: "loadConsumidor",
      },
    ],
    // onWhoami: [
    //   parent.onWhoami,
    //   // {
    //   //   log: () => ['GET CARRITO ACTIVO'],
    //   //   // condition: (_, { loginType }) => loginType === 'customer',
    //   //   type: 'appDispatch',
    //   //   name: 'getCarritoActivo'
    //   // },
    // ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
