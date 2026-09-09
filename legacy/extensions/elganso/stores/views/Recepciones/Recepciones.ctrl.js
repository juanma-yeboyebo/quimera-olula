import { navigate } from "quimera/base";
import { getSchemas, util } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Recepciones.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  abrirDialogo: false,
  abrirDialogoSincro: false,
  abrirDialogoObtenerRecepciones: false,
  mostrarSoloMisRecepciones: false,
  codAgente: util.getUser().user,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onEditViajeClicked: [
      {
        type: "setStateKeys",
        plug: (payload, { response }, state) => {
          const { idViaje } = payload;

          return {
            keys: {
              abrirDialogo: true,
              dialogTitle: `¿Asignar la recepción ${payload.idViaje} a  ${payload.usuarioEnvio}?`,
              idViaje,
            },
          };
        },
      },
    ],
    onCancelarAsignacionClicked: [
      {
        type: "setStateKeys",
        plug: (payload, { response }, state) => {
          return {
            keys: {
              abrirDialogo: false,
            },
          };
        },
      },
    ],
    onAsignarClicked: [
      {
        type: "setStateKeys",
        plug: (payload, { response }, state) => {
          return {
            keys: {
              abrirDialogo: false,
            },
          };
        },
      },
    ],
    onSincroViajeClicked: [
      {
        type: "setStateKeys",
        plug: (payload, { response }, state) => {
          return {
            keys: {
              abrirDialogoSincro: true,
              idViaje: payload.idViaje,
              dialogTitle: `¿Sincronizar la recepción ${payload.idViaje} y liberar el usuario?`,
            },
          };
        },
      },
    ],
    onCancelarAsignacionSincroClicked: [
      {
        type: "setStateKeys",
        plug: (payload, { response }, state) => {
          return {
            keys: {
              abrirDialogoSincro: false,
            },
          };
        },
      },
    ],
    onAsignarSincroClicked: [
      {
        type: "setStateKeys",
        plug: (payload, { response }, state) => {
          return {
            keys: {
              abrirDialogoSincro: false,
            },
          };
        },
      },
    ],
    asignarUsuarioRecepcion: [
      {
        type: "setStateKeys",
        plug: (payload, { response }, state) => {
          const {
            recepciones,
            idviajemultitrans,
            usuariorecepcion,
            setRecepcionesDbIndex,
            setRecepcionesIndexados,
          } = payload;

          const result = recepciones.find(
            recepcion => recepcion.idviajemultitrans === idviajemultitrans,
          );
          result.usuariorecepcion = usuariorecepcion;
          setRecepcionesDbIndex(recepciones);
          setRecepcionesIndexados(recepciones);
          navigate(`/editrecepcion/${idviajemultitrans}`);

          return {
            keys: {
              recepciones,
            },
          };
        },
      },
    ],
    setRecepciones: [
      {
        type: "setStateKeys",
        plug: (payload, { response }, state) => {
          const { recepcionesDbIndex, setRecepcionesDbIndex } = payload;

          let recepciones = payload.response.data;
          // Si tengo recepciones indexados los devuelvo si no devuelvo la consulta a pineboo
          if (recepcionesDbIndex && recepcionesDbIndex.length > 0) {
            recepciones = recepcionesDbIndex;
          } else {
            setRecepcionesDbIndex(payload.response.data);
          }

          return {
            keys: {
              recepciones,
              abrirDialogoObtenerRecepciones: false,
            },
          };
        },
      },
    ],
    onSincroRecepcion: [
      {
        type: "grape",
        name: "onSincroRecepcionClicked",
        plug: (payload, { response }, state) => {
          const { idviajemultitrans, recepciones } = payload;

          const result = recepciones.find(
            recepcion => recepcion.idviajemultitrans === idviajemultitrans,
          );
          const d = new Date();
          const year = d.getFullYear();
          const month = d.getMonth() > 8 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
          const day = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`;
          const fechaRecepcion = `${[year, month, day].join("-")}`;
          const hora = d.getHours() > 9 ? d.getHours() : `0${d.getHours()}`;
          const minutos = d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`;
          const segundos = d.getSeconds() > 9 ? d.getSeconds() : `0${d.getSeconds()}`;
          const horaRecepcion = `${[hora, minutos, segundos].join(":")}`;

          if (result.lineasModificadas) {
            for (const [key, value] of Object.entries(result.lineasModificadas)) {
              result.lineasModificadas[key]["fecharx"] = fechaRecepcion;
              result.lineasModificadas[key]["horarx"] = horaRecepcion;
            }
          }

          return {
            ...payload,
            idviajemultitrans,
            lineasEnvio: result.lineasModificadas,
          };
        },
      },
    ],
    sincroRecepcionSuccess: [
      {
        type: "setStateKeys",
        plug: (payload, { response }, state) => {
          return {
            keys: {
              abrirDialogoSincro: false,
            },
          };
        },
      },
      {
        type: "showMessage",
        plug: payload => ({
          mensaje: payload.response.msg,
          tipoMensaje: payload.response.result ? "success" : "error",
        }),
      },
      {
        condition: payload => payload.response.result,
        type: "function",
        function: payload => {
          const {
            recepciones,
            idviajemultitrans,
            response: { result },
            setRecepcionesDbIndex,
            setRecepcionesIndexados,
          } = payload;

          if (result) {
            const recepcionSeleccionado = recepciones.find(
              recepcion => recepcion.idviajemultitrans === idviajemultitrans,
            );
            delete recepcionSeleccionado.lineasModificadas;
            recepcionSeleccionado.usuariorecepcion = null;
            recepcionSeleccionado.lineasEnvio = "";
          }
          setRecepcionesDbIndex(recepciones);
          setRecepcionesIndexados(recepciones);
        },
      },
    ],
    getRecepciones: [
      {
        condition: payload =>
          !payload.recepcionesDbIndex || payload.recepcionesDbIndex.length === 0,
        type: "get",
        schema: getSchemas().envios,
        params: (payload, state) => ({
          anyos: payload["anyos"],
          almacenDestino: payload["codalmadestinoFiltro"],
        }),
        success: "setRecepciones",
      },
      {
        condition: payload => payload.recepcionesDbIndex && payload.recepcionesDbIndex.length > 0,
        type: "setStateKeys",
        plug: payload => {
          const { recepcionesDbIndex } = payload;

          return {
            keys: {
              recepciones: recepcionesDbIndex,
            },
          };
        },
      },
    ],
    descargarViajes: [
      {
        type: "setStateKeys",
        plug: payload => {
          const { recepcionesDbIndex } = payload;
          const recepcionesPendientes = recepcionesDbIndex.filter(
            recepcion => "lineasModificadas" in recepcion,
          );
          let msg = "¿Actualizar recepciones?";
          if (recepcionesPendientes.length > 0) {
            msg = `Existen ${recepcionesPendientes.length} recepciones pendientes de sincronizar. Si continua se eliminarán. ${msg}`;
          }

          return {
            keys: {
              abrirDialogoObtenerRecepciones: true,
              dialogTitle: msg,
            },
          };
        },
      },
    ],
    onCancelarObtenerRecepcionesClicked: [
      {
        type: "setStateKeys",
        plug: () => {
          return {
            keys: {
              abrirDialogoObtenerRecepciones: false,
            },
          };
        },
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
