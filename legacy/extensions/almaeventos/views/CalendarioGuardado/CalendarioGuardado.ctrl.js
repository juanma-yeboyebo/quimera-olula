import {
  addDays,
  differenceInDays,
  endOfMonth,
  format,
  getDay,
  isSameMonth,
  setDay,
  subDays,
} from "@quimera/thirdparty";
import { util } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./CalendarioGuardado.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    dibujaCalendarioGuardado: [
      {
        type: "setStateKeys",
        plug: ({ response }) => ({
          keys: {
            modo: response.datos.modo,
            anyo: response.datos.anyo,
            mes: response.datos.mes,
            mesYAnyo: util.mesYAnyoANombre(parseInt(response.datos.mes) + 1, response.datos.anyo),
            eventos: response.datos.eventos,
            dibujandoCalendario: true,
          },
        }),
      },
      {
        condition: (_, { modo }) => modo === "mes",
        type: "grape",
        name: "realizarCalendarioMensual",
      },
      {
        condition: (_, { modo }) => modo === "anyo",
        type: "grape",
        name: "realizarCalendarioAnual",
      },
    ],
    realizarCalendarioMensual: [
      {
        type: "function",
        function: (_, { anyo, mes }) => {
          // inicioVisible siempre va a ser un lunes, finVisible siempre va a ser un domingo
          const diaUnoDelMes = new Date(anyo, mes, 1);
          const diaFinDelMes = endOfMonth(new Date(anyo, mes, 1));

          const diaSemanaUnoMes = getDay(diaUnoDelMes); // vemos que dia de la semana es el 1 del mes
          const diaSemanaInicio = diaSemanaUnoMes === 0 ? subDays(diaUnoDelMes, 1) : diaUnoDelMes;
          const inicioVisibleAux = setDay(diaSemanaInicio, 1, { weekStartsOn: 1 }); // restamos los dias que haga falta hasta obtener el lunes (numero 1 del dia de la semana)

          const diaSemanaFinMes = getDay(diaFinDelMes); // vemos que dia de la semana es el fin del mes
          const finVisibleAux =
            diaSemanaFinMes !== 0 ? setDay(diaFinDelMes, 0, { weekStartsOn: 1 }) : diaFinDelMes; // sumamos los dias hasta encontrar el 0, domingo
          const inicioVisible = `${inicioVisibleAux.getFullYear()}-${String(
            inicioVisibleAux.getMonth() + 1,
          ).padStart(2, "0")}-${String(inicioVisibleAux.getDate()).padStart(2, "0")}`;
          const finVisible = `${finVisibleAux.getFullYear()}-${String(
            finVisibleAux.getMonth() + 1,
          ).padStart(2, "0")}-${String(finVisibleAux.getDate()).padStart(2, "0")}`;

          return { inicioVisible, finVisible };
        },
        success: [
          {
            type: "setStateKeys",
            plug: ({ response }) => ({
              keys: {
                inicioVisible: response.inicioVisible,
                finVisible: response.finVisible,
              },
            }),
          },
          {
            type: "grape",
            name: "addEventosACalendarioMensual",
          },
        ],
      },
    ],
    realizarCalendarioAnual: [
      {
        type: "setStateKeys",
        plug: (_, { anyo }) => ({
          keys: {
            inicioVisible: `${anyo}-01-01`,
            finVisible: `${anyo}-12-31`,
          },
        }),
      },
      {
        type: "grape",
        name: "addEventosACalendarioAnual",
      },
    ],
    addEventosACalendarioMensual: [
      {
        type: "function",
        function: (_, { anyo, mes, eventos, inicioVisible, finVisible }) => {
          const calendario = [];
          const unMes = [];

          const numSemanasAProcesar =
            (Math.abs(differenceInDays(new Date(inicioVisible), new Date(finVisible))) + 1) / 7; // diferencia entre inicio fin entre tamaño semana
          let fechaActual = new Date(inicioVisible);

          for (let i = 0; i < numSemanasAProcesar; i++) {
            const semana = [];
            for (let j = 0; j < 7; j++) {
              const objetosByFecha = eventos?.filter(
                registro =>
                  registro.fechaInicio.substring(0, 10) === format(fechaActual, "yyyy-MM-dd"),
              );

              const esEsteMes = isSameMonth(fechaActual, new Date(anyo, mes));
              semana[j] = {
                fecha: format(fechaActual, "yyyy-MM-dd"),
                esEsteMes,
                objetosDia: objetosByFecha,
                estaCargando: false,
              };
              fechaActual = addDays(new Date(fechaActual.getTime()), 1); // sumamos 1 dia a la fecha actual
            }
            unMes.push(semana);
          }
          calendario.push(unMes);

          return { calendario, inicioVisible, finVisible };
        },
        success: [
          {
            type: "setStateKey",
            plug: ({ response }) => ({ path: "calendario", value: response.calendario }),
          },
          {
            type: "grape",
            name: "calendarioDibujado",
          },
        ],
      },
    ],
    addEventosACalendarioAnual: [
      {
        type: "function",
        function: (_, { anyo, mes, eventos }) => {
          const calendario = [];

          for (let mesBucle = 0; mesBucle < 12; mesBucle++) {
            // inicioVisible siempre va a ser un lunes, finVisible siempre va a ser un domingo
            const unMes = [];
            const diaUnoDelMes = new Date(anyo, mesBucle, 1);
            const diaFinDelMes = endOfMonth(new Date(anyo, mesBucle, 1));

            const diaSemanaUnoMes = getDay(diaUnoDelMes); // vemos que dia de la semana es el 1 del mes
            const diaSemanaInicio = diaSemanaUnoMes === 0 ? subDays(diaUnoDelMes, 1) : diaUnoDelMes;
            const inicioVisibleAux = setDay(diaSemanaInicio, 1, { weekStartsOn: 1 }); // restamos los dias que haga falta hasta obtener el lunes (numero 1 del dia de la semana)

            const diaSemanaFinMes = getDay(diaFinDelMes); // vemos que dia de la semana es el fin del mes
            const finVisibleAux =
              diaSemanaFinMes !== 0 ? setDay(diaFinDelMes, 0, { weekStartsOn: 1 }) : diaFinDelMes; // sumamos los dias hasta encontrar el 0, domingo
            const inicioVisible = `${inicioVisibleAux.getFullYear()}-${String(
              inicioVisibleAux.getMonth() + 1,
            ).padStart(2, "0")}-${String(inicioVisibleAux.getDate()).padStart(2, "0")}`;
            const finVisible = `${finVisibleAux.getFullYear()}-${String(
              finVisibleAux.getMonth() + 1,
            ).padStart(2, "0")}-${String(finVisibleAux.getDate()).padStart(2, "0")}`;

            const numSemanasAProcesar =
              (Math.abs(differenceInDays(new Date(inicioVisible), new Date(finVisible))) + 1) / 7; // diferencia entre inicio fin entre tamaño semana
            let fechaActual = new Date(inicioVisible);

            for (let i = 0; i < numSemanasAProcesar; i++) {
              const semana = [];
              for (let j = 0; j < 7; j++) {
                const objetosByFecha = eventos?.filter(
                  registro =>
                    registro.fechaInicio.substring(0, 10) === format(fechaActual, "yyyy-MM-dd"),
                );

                const esEsteMes = isSameMonth(fechaActual, new Date(anyo, mesBucle));
                semana[j] = {
                  fecha: format(fechaActual, "yyyy-MM-dd"),
                  esEsteMes,
                  objetosDia: esEsteMes && objetosByFecha,
                  estaCargando: false,
                };
                fechaActual = addDays(new Date(fechaActual.getTime()), 1); // sumamos 1 dia a la fecha actual
              }
              unMes.push(semana);
            }
            calendario.push(unMes);
          }

          return { calendario };
        },
        success: [
          {
            type: "setStateKey",
            plug: ({ response }) => ({ path: "calendario", value: response.calendario }),
          },
          {
            type: "grape",
            name: "calendarioDibujado",
          },
        ],
      },
    ],
    hashcodeIncorrecto: [
      {
        type: "showMessage",
        plug: ({ response }) => ({
          mensaje: response,
          tipoMensaje: "error",
        }),
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
