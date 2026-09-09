import { navigate } from "quimera/base";
import { getSchemas, util } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Envios.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  abrirDialogo: false,
  abrirDialogoSincro: false,
  abrirDialogoObtenerEnvios: false,
  mostrarSoloMisEnvios: false,
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
              dialogTitle: `¿Asignar el envío ${payload.idViaje} a  ${payload.usuarioEnvio}?`,
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
              dialogTitle: `¿Sincronizar el envío ${payload.idViaje} y liberar el usuario?`,
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
    asignarUsuarioEnvio: [
      {
        type: "setStateKeys",
        plug: (payload, { response }, state) => {
          const { envios, idviajemultitrans, usuarioenvio, setEnviosDbIndex, setEnviosIndexados } =
            payload;

          const result = envios.find(envio => envio.idviajemultitrans === idviajemultitrans);
          result.usuarioenvio = usuarioenvio;
          setEnviosDbIndex(envios);
          setEnviosIndexados(envios);
          navigate(`/editenvio/${idviajemultitrans}`);

          return {
            keys: {
              envios,
            },
          };
        },
      },
    ],
    setEnvios: [
      {
        type: "setStateKeys",
        plug: (payload, { response }, state) => {
          const { enviosDbIndex, setEnviosDbIndex } = payload;

          let envios = payload.response.data;
          // Si tengo envios indexados los devuelvo si no devuelvo la consulta a pineboo
          if (enviosDbIndex && enviosDbIndex.length > 0) {
            envios = enviosDbIndex;
          } else {
            setEnviosDbIndex(payload.response.data);
          }

          return {
            keys: {
              envios,
              abrirDialogoObtenerEnvios: false,
            },
          };
        },
      },
    ],
    onSincroEnvio: [
      {
        type: "grape",
        name: "onSincroEnvioClicked",
        plug: (payload, { response }, state) => {
          const { idviajemultitrans, usuarioenvio, envios, setEnviosDbIndex, setEnviosIndexados } =
            payload;

          const result = envios.find(envio => envio.idviajemultitrans === idviajemultitrans);
          const d = new Date();
          const year = d.getFullYear();
          const month = d.getMonth() > 8 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
          const day = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`;
          const fechaEnvio = `${[year, month, day].join("-")}`;
          const hora = d.getHours() > 9 ? d.getHours() : `0${d.getHours()}`;
          const minutos = d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`;
          const segundos = d.getSeconds() > 9 ? d.getSeconds() : `0${d.getSeconds()}`;
          const horaEnvio = `${[hora, minutos, segundos].join(":")}`;

          if (result.lineasModificadas) {
            for (const [key, value] of Object.entries(result.lineasModificadas)) {
              result.lineasModificadas[key]["fechaex"] = fechaEnvio;
              result.lineasModificadas[key]["horaex"] = horaEnvio;
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
    sincroEnvioSuccess: [
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
            envios,
            idviajemultitrans,
            response: { result },
            setEnviosDbIndex,
            setEnviosIndexados,
          } = payload;

          if (result) {
            const envioSeleccionado = envios.find(
              envio => envio.idviajemultitrans === idviajemultitrans,
            );
            delete envioSeleccionado.lineasModificadas;
            envioSeleccionado.usuarioenvio = null;
            envioSeleccionado.lineasEnvio = "";
          }
          setEnviosDbIndex(envios);
          setEnviosIndexados(envios);
        },
      },
    ],
    getEnvios: [
      {
        condition: payload => !payload.enviosDbIndex || payload.enviosDbIndex.length === 0,
        type: "get",
        schema: getSchemas().envios,
        params: (payload, state) => ({
          anyos: payload["anyos"],
          almacenOrigen: payload["codalmaorigenFiltro"],
        }),
        success: "setEnvios",
      },
      {
        condition: payload => payload.enviosDbIndex && payload.enviosDbIndex.length > 0,
        type: "setStateKeys",
        plug: payload => {
          const { enviosDbIndex } = payload;

          return {
            keys: {
              envios: enviosDbIndex,
            },
          };
        },
      },
    ],
    descargarViajes: [
      {
        type: "setStateKeys",
        plug: payload => {
          const { enviosDbIndex } = payload;
          const enviosPendientes = enviosDbIndex.filter(envio => "lineasModificadas" in envio);
          let msg = "¿Actualizar envios?";
          if (enviosPendientes.length > 0) {
            msg = `Existen ${enviosPendientes.length} envios pendientes de sincronizar. Si continua se eliminarán. ${msg}`;
          }

          return {
            keys: {
              abrirDialogoObtenerEnvios: true,
              dialogTitle: msg,
            },
          };
        },
      },
    ],
    onCancelarObtenerEnviosClicked: [
      {
        type: "setStateKeys",
        plug: () => {
          return {
            keys: {
              abrirDialogoObtenerEnvios: false,
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
