import {
  addDays,
  addMonths,
  differenceInDays,
  endOfMonth,
  format,
  getDay,
  isSameMonth,
  setDay,
  subDays,
  subMonths,
} from "@quimera/thirdparty";
import { util } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./CalendarioEventos.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    obtenerMesAnyoActual: [
      {
        type: "function",
        function: ({ value }, { ausencias }) => {
          const hoy = new Date();
          const mesActual = String(hoy.getMonth()).padStart(2, "0"); // hoy.getMonth().toString().length === 1 ? `0${hoy.getMonth()}` : hoy.getMonth()
          const anyoActual = hoy.getUTCFullYear();

          return {
            mes: mesActual,
            anyo: anyoActual,
            anyoMes: util.mesYAnyoANombre(parseInt(mesActual) + 1, anyoActual),
          };
        },
        success: [
          {
            type: "setStateKeys",
            plug: ({ response }) => ({
              keys: {
                mes: response.mes,
                anyo: response.anyo,
                mesYAnyo: response.anyoMes,
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
            name: "cargaEventos",
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
        name: "cargaEventos",
      },
    ],
    addEventosACalendarioMensual: [
      {
        type: "function",
        function: (_, { anyo, mes, eventos, inicioVisible, finVisible }) => {
          const calendario = [];
          const unMes = [];
          const eventosArray = Object.values(eventos.dict);

          const numSemanasAProcesar =
            (Math.abs(differenceInDays(new Date(inicioVisible), new Date(finVisible))) + 1) / 7; // diferencia entre inicio fin entre tamaño semana
          let fechaActual = new Date(inicioVisible);

          for (let i = 0; i < numSemanasAProcesar; i++) {
            const semana = [];
            for (let j = 0; j < 7; j++) {
              const objetosByFecha = eventosArray?.filter(
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
          const eventosArray = Object.values(eventos.dict);

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
                const objetosByFecha = eventosArray?.filter(
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
    onCambiarMesClicked: [
      {
        type: "function",
        function: ({ tipo }, { anyo, mes, registrosFestivos, valoresFiltro }) => {
          let fecha = new Date(anyo, mes, 2);
          fecha = tipo === "anterior" ? subMonths(fecha, 1) : addMonths(fecha, 1);
          const mesCambiado =
            fecha.getMonth().toString().length === 1 ? `0${fecha.getMonth()}` : fecha.getMonth();
          const anyoCambiado = fecha.getUTCFullYear();
          // util.setSetting("CalendarioFestivos/mes", mesCambiado);
          // util.setSetting("CalendarioFestivos/anyo", anyoCambiado);

          return {
            mes: mesCambiado,
            anyo: anyoCambiado,
            anyoMes: util.mesYAnyoANombre(parseInt(mesCambiado) + 1, anyoCambiado),
          };
        },
        success: [
          {
            type: "setStateKeys",
            plug: ({ response }) => ({
              keys: {
                mes: response.mes,
                anyo: response.anyo,
                mesYAnyo: response.anyoMes,
                dibujandoCalendario: true,
              },
            }),
          },
          {
            type: "grape",
            name: "realizarCalendarioMensual",
          },
        ],
      },
    ],
    onCambiarAnyoClicked: [
      {
        type: "setStateKeys",
        plug: ({ tipo }, { mes, anyo }) => ({
          keys: {
            anyo: tipo === "anterior" ? anyo - 1 : anyo + 1,
            dibujandoCalendario: true,
          },
        }),
      },
      {
        type: "grape",
        name: "realizarCalendarioAnual",
      },
    ],
    onHoyClicked: [
      {
        type: "function",
        function: (_, { valoresFiltro }) => {
          const fecha = new Date();
          const mesHoy =
            fecha.getMonth().toString().length === 1 ? `0${fecha.getMonth()}` : fecha.getMonth();
          const anyoHoy = fecha.getUTCFullYear();

          return {
            mes: mesHoy,
            anyo: anyoHoy,
            anyoMes: util.mesYAnyoANombre(parseInt(mesHoy) + 1, anyoHoy),
            // valoresFiltro: miFiltroActual,
          };
        },
        success: [
          {
            type: "setStateKeys",
            plug: ({ response }) => ({
              keys: {
                mes: response.mes,
                anyo: response.anyo,
                mesYAnyo: response.anyoMes,
                dibujandoCalendario: true,
                // selectedDate: new Date(response.anyo, response.mes),
                // valoresFiltro: response.valoresFiltro,
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
      },
    ],
    onCalendarioCreado: [
      {
        condition: ({ response }) => !!response.hashcode,
        type: "function",
        function: ({ response }) => {
          navigator.clipboard.writeText(
            `${util.getEnvironment().getUrlDict().almaeventos}/calendarios/${response.hashcode}`,
          );
        },
        success: [
          {
            type: "showMessage",
            plug: () => ({ mensaje: `Enlace copiado al portapapeles`, tipoMensaje: "success" }),
          },
        ],
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
