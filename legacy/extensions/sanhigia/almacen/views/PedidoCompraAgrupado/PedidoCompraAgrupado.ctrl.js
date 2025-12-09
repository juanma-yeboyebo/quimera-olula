import { util } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./PedidoCompraAgrupado.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  logic: {
    ...parent.logic,
    pedidoEditable: pedido => pedido.estadoPda !== "Enviado",
  },
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onQuitarTrabajadorClicked: [
      {
        type: "userConfirm",
        question: () => ({
          titulo: "Quitar trabajador",
          cuerpo: "Seguro que desea quitar el trabajador asignado a este pedido.",
          textoSi: "CONFIRMAR",
          textoNo: "CANCELAR",
        }),
        onConfirm: "onQuitarTrabajadorConfirmado",
        onCancel: "focusCodBarras",
      },
    ],
    compruebaCambiaEstadoPda: [
      {
        condition: ({ response }, { pedido }) =>
          !!response?.estadoPda && pedido.buffer?.estadoPda !== response?.estadoPda,
        type: "grape",
        name: "onEstadoPdaActualizado",
      },
    ],
    onQuitarTrabajadorConfirmado: [
      {
        type: "grape",
        name: "onTrabajadorActualizado",
        plug: payload => ({ codTrabajador: null, nombreTrabajador: null, ...payload }),
      },
    ],
    compruebaAniadirTrabajador: [
      {
        condition: (_, { pedido }) =>
          pedido.buffer.codtrabajador !== util.getUser().codtrabajador &&
          pedido.buffer?.estadoPda === "Pendiente" &&
          pedido.buffer.servido !== "Sí",
        type: "grape",
        name: "onTrabajadorActualizado",
        plug: payload => ({
          codTrabajador: util.getUser().codtrabajador,
          nombreTrabajador: util.getUser().nombretrabajador,
          ...payload,
        }),
      },
    ],
    focusCodBarras: [
      {
        condition: () => !!document.getElementById("codBarras"),
        type: "function",
        function: () => document.getElementById("codBarras").select(),
      },
    ],
    irAMovilotes: [
      {
        log: (payload, state) => ['mimensaje_nombre', payload],
        type: "navigate",
        url: ({ idLinea, idPedido }) => `/pedidosdecompra/${idPedido}/movilotes/${idLinea}`,
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
