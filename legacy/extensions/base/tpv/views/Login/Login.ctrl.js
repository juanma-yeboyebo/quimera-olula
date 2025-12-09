import { util } from "quimera";
import { MasterAPI, MasterCtrl } from "quimera/lib";

import { TpvDb } from "../../lib";
import schemas from "../../static/schemas";

export const state = parent => ({
  ...parent,
  puntosVenta: MasterCtrl(schemas.puntosventa),
  puntoVentaActual: TpvDb.getPuntoVenta()?.puntoventa?.codigo,
});

const goOnLoginCondition = () =>
  !!TpvDb.getPuntoVenta()?.puntoventa?.codigo && !!util.getUser()?.tpv_agente;

const goOnLoginError = () => {
  if (!TpvDb.getPuntoVenta()?.puntoventa?.clienteTpv) {
    return "No puede acceder a la aplicación sin un código de cliente de TPV. Puede modificarlo en el ERP en Área de facturación => TPV => Configuración => Cliente Facturación";
  }

  return false;
};

const authError = () => {
  if (!util.getUser().tpv_agente) {
    return "Las credenciales son correctas. Pero no puede acceder a la aplicación sin un código de agente de TPV";
  }

  return false;
};

export const bunch = parent => ({
  ...parent,
  ...MasterAPI({
    name: "puntosVenta",
    table: "tpv_puntosventa",
    schema: schemas.puntosventa,
  }),
  onPuntoVentaActualChanged: [
    {
      type: "function",
      function: ({ option }) => TpvDb.setPuntoVenta(option),
    },
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "puntoVentaActual", value }),
    },
    {
      type: "grape",
      name: "goOnLogin",
    },
  ],
  goOnLogin: [
    {
      condition: goOnLoginCondition,
      type: "grape",
      name: "updatePuntoVenta",
    },
    {
      condition: () => !!goOnLoginCondition() && !goOnLoginError(),
      type: "action",
      action: parent.goOnLogin,
    },
    {
      condition: () => !!goOnLoginCondition() && !!goOnLoginError(),
      type: "setStateKeys",
      plug: () => ({
        keys: {
          error: goOnLoginError(),
        },
      }),
    },
  ],
  updatePuntoVenta: [
    {
      log: () => ["updateXPuntoVenta"],
      type: "get",
      action: "get_config",
      id: () => TpvDb.getPuntoVenta()?.puntoventa?.codigo,
      schema: schemas.puntosventa_config,
      success: "onGetUpdatedPuntoVenta",
    },
  ],
  onGetUpdatedPuntoVenta: [
    {
      type: "function",
      function: ({ response }) => TpvDb.setPuntoVenta(response.data),
    },
  ],
  setAuthenticationKeys: [
    {
      type: "setStateKeys",
      plug: () => ({
        keys: {
          autenticado: !!util.getUser().tpv_agente,
          autenticando: false,
          error: authError(),
        },
      }),
    },
  ],
});
