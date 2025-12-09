import { getSchemas } from "quimera";
import { ModelAPI, ModelCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  tipostrato: ModelCtrl(getSchemas().tipotrato),
  tipotratoBuffer: {},
  nombreCausaNueva: "",
  causasPerdidaTrato: [],
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "tipostrato",
    id: "id",
    schema: getSchemas().tipotrato,
    url: "/ss/tipostrato",
  }),
  onInit: [
    {
      type: "grape",
      name: "getTipostrato",
    },
  ],
  onGetTipostratoSucceded: [
    {
      type: "grape",
      name: "cargaBufferTiposTrato",
    },
  ],
  onAtrasClicked: [
    {
      type: "navigate",
      url: () => "/ss/tipostrato",
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "tipostrato.current", value: null }),
    },
  ],
  onIdTipostratoChanged: [
    {
      type: "grape",
      name: "cargaBufferTiposTrato",
    },
    {
      type: "grape",
      name: "limpiaNombreCausaNueva",
    },
  ],
  cargaBufferTiposTrato: [
    {
      condition: (_payload, { tipostrato }) => tipostrato.current,
      type: "setStateKey",
      plug: (_payload, { tipostrato }) => ({
        path: "tipostratoBuffer",
        value: { ...tipostrato.dict[tipostrato.current] },
      }),
    },
    {
      condition: (_payload, { tipostrato }) =>
        !!tipostrato.current && tipostrato.current !== "nuevo",
      type: "grape",
      name: "getCausasPerdidaTipo",
    },
  ],
  limpiaNombreCausaNueva: [
    {
      type: "setStateKey",
      plug: () => ({
        path: "nombreCausaNueva",
        value: "",
      }),
    },
  ],
  onSeccionConfirmada: [
    {
      type: "setStateKey",
      plug: ({ fields }, { tipostrato, tipostratoBuffer }) => ({
        path: "tipostrato.dict",
        value: {
          ...tipostrato.dict,
          [tipostrato.current]: fields.reduce(
            (accum, item) => ({ ...accum, [item]: tipostratoBuffer[item] }),
            tipostrato.dict[tipostrato.current],
          ),
        },
      }),
    },
    {
      condition: ({ onSuccess }) => !!onSuccess,
      type: "function",
      function: ({ onSuccess }) => onSuccess && onSuccess(),
    },
    {
      condition: (_, { tipostrato }) => !!tipostrato.current,
      type: "patch",
      schema: getSchemas().tipotrato,
      id: (_, { tipostrato }) => tipostrato.current,
      data: ({ fields }, { tipostrato }) =>
        fields.reduce(
          (accum, key) => ({
            ...accum,
            [key]: tipostrato.dict[tipostrato.current][key],
          }),
          {},
        ),
      success: "onTipoTratoUpdated",
    },
  ],
  onTipoTratoUpdated: [
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Tipo de trato actualizado correctamente",
        tipoMensaje: "success",
      }),
    },
  ],
  onSeccionCancelada: [
    {
      type: "setStateKey",
      plug: ({ fields }, { tipostrato, tipostratoBuffer }) => ({
        path: "tipostratoBuffer",
        value: {
          ...tipostratoBuffer,
          ...fields.reduce(
            (accum, item) => ({
              ...accum,
              [item]: tipostrato.dict[tipostrato.current][item],
            }),
            tipostratoBuffer,
          ),
        },
      }),
    },
  ],
  onTipoSeccionConfirmada: [
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["tipo"] }),
    },
  ],
  onTipoSeccionCancelada: [
    {
      type: "grape",
      name: "onSeccionCancelada",
      plug: () => ({ fields: ["tipo"] }),
    },
  ],
  onNuevoTipoTratoClicked: [
    {
      type: "grape",
      name: "onTipostratoClicked",
      plug: _p => ({ item: { id: "nuevo" } }),
    },
  ],
  onGuardarNuevoTipoTratoClicked: [
    {
      type: "post",
      schema: getSchemas().tipotrato,
      data: (_, { tipostratoBuffer }) => tipostratoBuffer,
      success: "onTipoTratoCreated",
    },
  ],
  onTipoTratoCreated: [
    {
      type: "showMessage",
      plug: (_, { tipostratoBuffer }) => ({
        mensaje: `Tipo de trato '${tipostratoBuffer.tipo}' creado correctamente`,
        tipoMensaje: "success",
      }),
    },
    {
      type: "grape",
      name: "getTipostrato",
    },
    {
      type: "navigate",
      url: (_, { tipostratoBuffer }) => `/ss/tipostrato/${tipostratoBuffer.id}`,
    },
  ],
  onEliminarTipoTratoSeccionConfirmada: [
    {
      type: "delete",
      schema: getSchemas().tipotrato,
      id: (_, { tipostrato }) => tipostrato.current,
      success: "onTipoTratoDeleted",
    },
  ],
  onTipoTratoDeleted: [
    {
      type: "grape",
      name: "onAtrasClicked",
    },
    {
      type: "grape",
      name: "getTipostrato",
    },
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Tipo de trato eliminado correctamente",
        tipoMensaje: "success",
      }),
    },
  ],
  handleTextFieldKey: [
    {
      condition: ({ event }) =>
        event.keyCode === 13 &&
        event.target.value.length > 0 &&
        event.target.id.includes("nombreCausaNueva"),
      type: "grape",
      name: "onAnadirCausaClicked",
    },
    // {
    //   condition: ({ event }) =>
    //     event.keyCode === 13 && event.target.id.includes("subtareasNombres"),
    //   type: "grape",
    //   name: "onConfirmarCambiarNombreSubtarea",
    // },
  ],
  onAnadirCausaClicked: [
    {
      type: "post",
      schema: getSchemas().causasPerdidaTrato,
      data: (_, { nombreCausaNueva, tipostratoBuffer }) => ({
        idTipoTrato: tipostratoBuffer.id,
        descripcion: nombreCausaNueva,
      }),
      success: "causaAnadidaSuccess",
      error: "causaAnadidaError",
    },
  ],
  causaAnadidaSuccess: [
    {
      type: "grape",
      name: "limpiaNombreCausaNueva",
    },
    {
      type: "grape",
      name: "getCausasPerdidaTipo",
    },
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Causa perdida trato añadida",
        tipoMensaje: "success",
      }),
    },
  ],
  causaAnadidaError: [
    {
      type: "grape",
      name: "limpiaNombreCausaNueva",
    },
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "No se ha añadido causa perdida trato",
        tipoMensaje: "error",
      }),
    },
  ],
  getCausasPerdidaTipo: [
    {
      type: "get",
      schema: getSchemas().causasPerdidaTrato,
      filter: (payload, { tipostratoBuffer }) => ["idtipotrato", "eq", tipostratoBuffer.id],
      page: () => ({ limit: 100 }),
      success: "onCausasPerdidaTipoSuccess",
    },
  ],
  onCausasPerdidaTipoSuccess: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({
        path: "causasPerdidaTrato",
        value: response.data,
      }),
    },
  ],
  onBorrarCausaClicked: [
    {
      type: "delete",
      schema: getSchemas().causasPerdidaTrato,
      id: ({ linea }) => linea.idPerdida,
      success: `onBorrarCausaSuccess`,
      error: `onBorrarCausaError`,
    },
  ],
  onBorrarCausaSuccess: [
    {
      type: "grape",
      name: "getCausasPerdidaTipo",
    },
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Causa perdida trato eliminada",
        tipoMensaje: "success",
      }),
    },
  ],
  onBorrarCausaError: [
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "No se ha eliminado causa perdida trato",
        tipoMensaje: "error",
      }),
    },
  ],
  onTipostratoBufferAvisoAgentePorDefectoChanged: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "tipostratoBuffer.avisoAgentePorDefecto", value }),
    },
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["avisoAgentePorDefecto"] }),
    },
  ],
  onTipostratoBufferExigirGenerarPedidoChanged: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "tipostratoBuffer.exigirGenerarPedido", value }),
    },
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["exigirGenerarPedido"] }),
    },
  ],
  onTareaInicialTratoSeccionConfirmada: [
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["tareaInicialTrato"] }),
    },
  ],
  onTareaInicialTratoSeccionCancelada: [
    {
      type: "grape",
      name: "onSeccionCancelada",
      plug: payload => ({ ...payload, fields: ["tareaInicialTrato"] }),
    },
  ],
});
