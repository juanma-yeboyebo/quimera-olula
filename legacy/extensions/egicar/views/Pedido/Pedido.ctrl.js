import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Pedido.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  logic: {
    ...parent.logic,
    // parteEditable: parte => parte.firmado && parte.firmado === false,
    parteEditable: parte => !parte.firmado,
  },
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
    // onGenerarAlbaranParcialClicked: [
    //   {
    //     type: "userConfirm",
    //     question: () => ({
    //       titulo: "Generar albarán",
    //       cuerpo:
    //         "Se generará un albarán parcial con las cantidades a enviar asociadas a las líneas que sean mayor de 0.",
    //       textoSi: "CONFIRMAR",
    //       textoNo: "CANCELAR",
    //     }),
    //     onConfirm: "procesaLineasAEnviar",
    //   },
    // ],
    procesaLineasAEnviar: [
      {
        type: "function",
        function: (_, { lineas }) => {
          const lineasAEnviar = {};
          Object.values(lineas.dict)
            .filter(l => l.cantAEnviar > 0)
            .forEach(l => (lineasAEnviar[l.idLinea] = l));

          return { lineasAEnviar };
        },
        success: "onGenerarAlbaranParcialConfirmado",
      },
    ],
  };
};
