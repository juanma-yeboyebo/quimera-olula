import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Inventario.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  logic: {
    ...parent.logic,
    pedidoEditable: pedido => pedido.editable && pedido.estadoPda !== "Enviado",
  },
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onCantidadChanged: [],
    onCerrarAbrirInventarioClicked: [
      {
        type: "userConfirm",
        question: (_, { inventario }) => ({
          titulo: `${inventario.buffer.estado === "Abierto" ? "Cerrar inventario" : "Abrir inventario"
            }`,
          cuerpo: `${inventario.buffer.estado === "Abierto"
              ? "Una vez cerrado el inventario no se podrá modificar."
              : "Una vez abierto el inventario se podrá modificar nuevamente."
            }`,
          textoSi: "CONFIRMAR",
          textoNo: "CANCELAR",
        }),
        onConfirm: "onCerrarAbrirInventarioConfirmado",
      },
    ],
    onCerrarLineaSuccess: [
      {
        // log: (a, b) => ["milog", a, b],
        type: "setStateKey",
        plug: ({ idLinea, response }, { lineas }) => ({
          path: "lineas.dict",
          value: {
            ...lineas.dict,
            [idLinea]: {
              ...lineas.dict[idLinea],
              sh_estado: response.sh_estado,
              cantidad: response.cantidadfin
            },
          },
        }),
      },
    ]
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};


// lineas = {
//   **lineas,
//   [idlinea]: {
//     ** lineas[idlinea],
//     cerrado: true
//   }
// }