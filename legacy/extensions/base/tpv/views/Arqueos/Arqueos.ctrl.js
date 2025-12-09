import { ModelAPI, ModelCtrl } from "quimera/lib";

import { TpvDb } from "../../lib";
import schemas from "../../static/schemas";

export const state = parent => ({
  ...parent,
  arqueos: ModelCtrl(schemas.arqueos),
  pagos: ModelCtrl(schemas.pagosArqueo),
  arqueosBuffer: {},
  monedasBuffer: {},
  billetesBuffer: {},
  arqueoAbierto: false,
  abrirDialogoImporteInicial: false,
  importeInicial: 0,
  indiceTab: 0,
  nuevoArqueo: false,
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "arqueos",
    id: "id",
    schema: schemas.arqueos,
    url: "/arqueos",
  }),
  ...ModelAPI({
    name: "pagos",
    id: "idpago",
    schema: schemas.pagosArqueo,
    action: "get_pagos",
  }),
  onInit: [
    {
      type: "grape",
      name: "getArqueos",
    },
  ],
  onGetArqueosSucceded: [
    {
      type: "grape",
      name: "cargaBufferArqueo",
    },
    {
      type: "grape",
      name: "comprobarArqueoAbierto",
    },
  ],
  onAtrasClicked: [
    {
      type: "navigate",
      url: () => "/arqueos",
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "arqueos.current", value: null }),
    },
  ],
  onTabSelected: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "indiceTab", value }),
    },
  ],
  onIdArqueosChanged: [
    {
      type: "grape",
      name: "cargaBufferArqueo",
    },
    {
      condition: (_payload, { arqueos }) => arqueos.current,
      type: "grape",
      name: "getPagos",
    },
  ],
  cargaBufferArqueo: [
    {
      condition: (_payload, { arqueos }) => arqueos.current,
      type: "setStateKeys",
      plug: (_, { arqueos, importeInicial }) => ({
        keys: {
          arqueosBuffer: { ...arqueos.dict[arqueos.current] },
          monedasBuffer: arqueos.dict[arqueos.current]?.valorcantmonedas
            .split(";")
            .slice(0, -1)
            .map(item => item.split("|"))
            .reduce(
              (acuum, item) => ({ ...acuum, [item[0].replace(".", "_")]: parseInt(item[1] ?? 0) }),
              {},
            ),
          billetesBuffer: arqueos.dict[arqueos.current]?.valorcantbilletes
            .split(";")
            .slice(0, -1)
            .map(item => item.split("|"))
            .reduce((acuum, item) => ({ ...acuum, [item[0]]: parseInt(item[1] ?? 0) }), {}),
        },
      }),
    },
  ],
  onBilletesBufferChanged: [
    {
      type: "setStateKey",
      plug: payload => ({ path: `billetesBuffer.${payload.field}`, value: payload.value ?? 0 }),
    },
    {
      type: "grape",
      name: "recargarEfectivoCaja",
    },
  ],
  onMonedasBufferChanged: [
    {
      type: "setStateKey",
      plug: payload => ({ path: `monedasBuffer.${payload.field}`, value: payload.value ?? 0 }),
    },
    {
      type: "grape",
      name: "recargarEfectivoCaja",
    },
  ],
  onArqueosBufferTotaltarjetaChanged: [
    {
      type: "setStateKey",
      plug: payload => ({ path: `arqueosBuffer.totaltarjeta`, value: payload.value }),
    },
    {
      type: "grape",
      name: "recargarEfectivoCaja",
    },
  ],
  onArqueosBufferTotalvaleChanged: [
    {
      type: "setStateKey",
      plug: payload => ({ path: `arqueosBuffer.totalvale`, value: payload.value }),
    },
    {
      type: "grape",
      name: "recargarEfectivoCaja",
    },
  ],
  recargarEfectivoCaja: [
    {
      type: "function",
      function: (_, { monedasBuffer, billetesBuffer }) => ({
        totalmonedas: Object.keys(monedasBuffer).reduce(
          (acuum, item) => acuum + item.replace("_", ".") * monedasBuffer[item],
          0,
        ),
        totalbilletes: Object.keys(billetesBuffer).reduce(
          (acuum, item) => acuum + item * billetesBuffer[item],
          0,
        ),
      }),
      success: [
        {
          type: "setStateKeys",
          plug: ({ response }, { arqueosBuffer }) => ({
            keys: {
              arqueosBuffer: {
                ...arqueosBuffer,
                totalcaja: response.totalmonedas + response.totalbilletes,
                diferenciaefectivo:
                  response.totalmonedas +
                  response.totalbilletes -
                  (arqueosBuffer.pagosefectivo + arqueosBuffer.inicio),
                diferenciatarjeta: arqueosBuffer.totaltarjeta - arqueosBuffer.pagostarjeta,
                diferenciavale: arqueosBuffer.totalvale - arqueosBuffer.pagosvale,
              },
            },
          }),
        },
        {
          type: "grape",
          name: "guardarArqueo",
        },
      ],
    },
  ],
  guardarArqueo: [
    {
      type: "function",
      function: (_, { monedasBuffer, billetesBuffer }) => ({
        stringmonedas: `${Object.keys(monedasBuffer)
          .map(item => {
            return `${item.replace("_", ".")}|${monedasBuffer[item] ?? 0}`;
          })
          .join(";")};`,
        stringbilletes: `${Object.keys(billetesBuffer)
          .map(item => {
            return `${item}|${billetesBuffer[item] ?? 0}`;
          })
          .join(";")};`,
      }),
      success: [
        {
          type: "setStateKey",
          plug: ({ response }, { arqueos, arqueosBuffer }) => ({
            path: "arqueos.dict",
            value: {
              ...arqueos.dict,
              [arqueos.current]: {
                ...arqueos.dict[arqueos.current],
                ...arqueosBuffer,
                valorcantbilletes: response.stringbilletes,
                valorcantmonedas: response.stringmonedas,
              },
            },
          }),
        },
        {
          type: "setStateKey",
          plug: ({ response }, { arqueos, arqueosBuffer }) => ({
            path: "arqueosBuffer",
            value: {
              ...arqueosBuffer,
              valorcantbilletes: response.stringbilletes,
              valorcantmonedas: response.stringmonedas,
            },
          }),
        },
        {
          type: "grape",
          name: "guardarArqueoBD",
        },
      ],
    },
  ],
  comprobarArqueoAbierto: [
    {
      type: "function",
      function: (_payload, { arqueos }) => ({
        estado:
          Object.values(arqueos.dict).filter(arqueo => arqueo.abierta === true).length > 0
            ? true
            : false,
      }),
      success: [
        {
          type: "setStateKey",
          plug: ({ response }) => ({ path: "arqueoAbierto", value: response.estado }),
        },
      ],
    },
  ],
  onCerrarArqueoClicked: [
    {
      condition: () =>
        !Object.values(TpvDb.getVentas() ?? {}).some(v => v.cerrada && !v.sincronizada),
      type: "patch",
      schema: schemas.arqueos,
      action: "cerrar_arqueo",
      id: (_, { arqueos }) => arqueos.current,
      success: "onArqueoCerrado",
    },
    {
      condition: () =>
        Object.values(TpvDb.getVentas() ?? {}).some(v => v.cerrada && !v.sincronizada),
      type: "showMessage",
      plug: () => ({
        mensaje: "No se puede cerrar el arqueo porque todavía existen ventas sin sincronizar",
        tipoMensaje: "error",
      }),
    },
  ],
  onArqueoCerrado: [
    {
      type: "setStateKey",
      plug: () => ({ path: "arqueoAbierto", value: false }),
    },
    {
      type: "showMessage",
      plug: () => ({ mensaje: "Arqueo cerrado con éxito.", tipoMensaje: "success" }),
    },
    {
      type: "grape",
      name: "getArqueos",
    },
  ],
  onNuevoArqueoClicked: [
    {
      condition: (_, { arqueoAbierto }) => !arqueoAbierto,
      type: "setStateKey",
      plug: () => ({ path: "abrirDialogoImporteInicial", value: true }),
    },
  ],
  onCrearArqueoClicked: [
    {
      type: "setStateKey",
      plug: () => ({ path: "abrirDialogoImporteInicial", value: false }),
    },
    {
      type: "post",
      schema: schemas.arqueos,
      data: (_, { importeInicial }) => schemas.arqueos.load({ inicio: importeInicial }),
      success: [
        {
          type: "setStateKey",
          plug: ({ response }) => ({
            path: "arqueos.current",
            value: response.pk,
          }),
        },
        {
          type: "grape",
          name: "getArqueos",
        },
        {
          type: "navigate",
          url: (_, { arqueos }) => `/arqueos/${arqueos.current}`,
        },
      ],
    },
  ],
  onCerrarImporteInicial: [
    {
      type: "setStateKeys",
      plug: () => ({
        keys: {
          abrirDialogoImporteInicial: false,
          importeInicial: 0,
        },
      }),
    },
  ],
  guardarArqueoBD: [
    {
      type: "post",
      schema: schemas.arqueos,
      data: (_, { arqueosBuffer }) => arqueosBuffer,
      success: [
        {
          type: "function",
          function: () => console.log("GUARDADO"),
        },
      ],
    },
  ],
});
