import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";
import { util } from "quimera";
import data from "./EnviarAlbaranFirmaExterna.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  mandarPuestoFirmaData: {
    fecha: util.today(),
    hora: util.now(),
  },
  puesto: util.getUser()?.user,
  logic: {
    ...parent.logic,
  },
});



export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    // setInitMandarPuestoFirmaData: [
    //   {
    //     type: "setStateKey",
    //     plug: () => ({
    //       path: "mandarPuestoFirmaData", value: {
    //         fecha: util.today(),
    //         hora: util.now(),
    //       }
    //     }),
    //   },
    //   {
    //     type: "setStateKey",
    //     plug: () => ({
    //       path: "modalFirmanteExterno", value: false
    //     }),
    //   },
    // ],
    // iniciarVigilanciaFirmaExterna: [
    //   {
    //     type: "function",
    //     function: ({ value }, { ausencias }) => {
    //       const hoy = new Date();
    //       const mesActual = String(hoy.getMonth()).padStart(2, "0"); // hoy.getMonth().toString().length === 1 ? `0${hoy.getMonth()}` : hoy.getMonth()
    //       const anyoActual = hoy.getUTCFullYear();

    //       return {
    //         mes: mesActual,
    //         anyo: anyoActual,
    //         anyoMes: util.mesYAnyoANombre(parseInt(mesActual) + 1, anyoActual),
    //       };
    //     },
    //     success: [
    //       {
    //         type: "setStateKeys",
    //         plug: ({ response }) => ({
    //           keys: {
    //             mes: response.mes,
    //             anyo: response.anyo,
    //             mesYAnyo: response.anyoMes,
    //             dibujandoCalendario: true,
    //           },
    //         }),
    //       },
    //       {
    //         condition: (_, { modo }) => modo === "mes",
    //         type: "grape",
    //         name: "realizarCalendarioMensual",
    //       },
    //       {
    //         condition: (_, { modo }) => modo === "anyo",
    //         type: "grape",
    //         name: "realizarCalendarioAnual",
    //       },
    //     ],
    //   },
    // ]
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
