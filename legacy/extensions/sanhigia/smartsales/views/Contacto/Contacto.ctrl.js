import { getSchemas, util } from "quimera";
import { DetailAPI, DetailCtrl, MasterAPI, MasterCtrl, ModelAPI, ModelCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  codContacto: null,
  contactoBuffer: {},
  nuevaNota: "",
  noEncontrado: false,
  contacto: DetailCtrl(getSchemas().contacto),
  tratos: MasterCtrl(getSchemas().trato, {
    limit: 7,
    filter: { and: [["estado", "not_in", ["Ganado", "Perdido"]]] },
  }),
  tareas: ModelCtrl(getSchemas().tareaContacto, {
    limit: 7,
    filter: { and: [["completada", "eq", "false"]] },
  }),
  eventos: MasterCtrl(getSchemas().eventosContacto),
  mostrarHistoricoTratos: false,
  mostrarHistoricoTareas: false,
  notas: MasterCtrl(getSchemas().notaContacto),
});

export const bunch = parent => ({
  ...parent,
  ...DetailAPI({
    name: "contacto",
    key: "codContacto",
    schema: getSchemas().contacto,
  }),
  ...MasterAPI({
    name: "tratos",
    key: "idTrato",
    schema: getSchemas().trato,
  }),
  ...ModelAPI({
    name: "tareas",
    id: "idTarea",
    schema: getSchemas().tareaContacto,
    action: "get_by_contacto",
  }),
  ...MasterAPI({
    name: "notas",
    key: "idNota",
    schema: getSchemas().notaContacto,
    action: "get_notas",
  }),
  ...MasterAPI({
    name: "eventos",
    id: "codEvento",
    schema: getSchemas().eventosContacto,
    action: "get_eventos_contacto",
  }),
  onInit: [
    {
      type: "setStateKey",
      plug: ({ idContacto }) => ({ path: "codContacto", value: idContacto }),
    },
    {
      type: "grape",
      name: "getContacto",
    },
  ],
  onGetContactoSucceded: [
    {
      type: "setStateKey",
      plug: (_, { contacto }) => ({
        path: "noEncontrado",
        value: !contacto?.codContacto,
      }),
    },
    {
      type: "grape",
      name: "cargaBuffer",
    },
    {
      type: "grape",
      name: "getTratos",
      plug: () => ({
        getTratosParams: { sinAgenteObservador: true },
      }),
    },
    {
      type: "setStateKey",
      plug: () => ({
        path: "tareas.filter.and",
        value: [["completada", "eq", "false"]],
      }),
    },
    {
      type: "grape",
      name: "getTareas",
      plug: () => ({
        getTratosParams: { sinAgenteObservador: true },
      }),
    },
    {
      type: "setStateKey",
      plug: (_, { contacto }) => ({
        path: "notas.filter.and",
        value: [["codcontacto", "eq", contacto?.codContacto]],
      }),
    },
    {
      type: "grape",
      name: "getNotas",
    },
    {
      type: "setStateKey",
      plug: (_, { contacto }) => ({
        path: "eventos.filter.and",
        value: [["codcontacto", "eq", contacto?.codContacto]],
      }),
    },
    {
      type: "grape",
      name: "getEventos",
    },
  ],
  cargaBuffer: [
    {
      type: "setStateKey",
      plug: (_, { contacto }) => ({
        path: "contactoBuffer",
        value: { ...contacto },
      }),
    },
  ],
  onSeccionConfirmada: [
    {
      type: "setStateKey",
      plug: ({ fields }, { contacto, contactoBuffer }) => ({
        path: "contacto",
        value: fields.reduce(
          (accum, item) => ({ ...accum, [item]: contactoBuffer[item] }),
          contacto,
        ),
      }),
    },
    {
      condition: ({ onSuccess }) => !!onSuccess,
      type: "function",
      function: ({ onSuccess }) => onSuccess && onSuccess(),
    },
    {
      type: "patch",
      schema: getSchemas().contacto,
      id: (_, { contacto }) => contacto.codContacto,
      data: ({ fields }, { contacto }) =>
        fields.reduce((accum, key) => ({ ...accum, [key]: contacto[key] }), {}),
      success: "onContactoUpdated",
    },
  ],
  onContactoUpdated: [
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Contacto actualizado correctamente",
        tipoMensaje: "success",
      }),
    },
  ],
  onSeccionCancelada: [
    {
      type: "setStateKey",
      plug: ({ fields }, { contacto, contactoBuffer }) => ({
        path: "contactoBuffer",
        value: fields.reduce(
          (accum, item) => ({ ...accum, [item]: contacto?.[item] }),
          contactoBuffer,
        ),
      }),
    },
  ],
  onCabeceraSeccionConfirmada: [
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["nombre", "email"] }),
    },
  ],
  onCabeceraSeccionCancelada: [
    {
      type: "grape",
      name: "onSeccionCancelada",
      plug: () => ({ fields: ["nombre", "email"] }),
    },
  ],
  onTelefonoSeccionConfirmada: [
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["telefono"] }),
    },
  ],
  onTelefonoSeccionCancelada: [
    {
      type: "grape",
      name: "onSeccionCancelada",
      plug: () => ({ fields: ["telefono"] }),
    },
  ],
  onDetallesSeccionConfirmada: [
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({
        ...payload,
        fields: ["direccion", "codPostal", "cliente"],
      }),
    },
  ],
  onDetallesSeccionCancelada: [
    {
      type: "grape",
      name: "onSeccionCancelada",
      plug: () => ({ fields: ["direccion", "codPostal", "cliente"] }),
    },
  ],
  onNuevaNotaEnter: [
    {
      type: "post",
      schema: getSchemas().notaContacto,
      action: "add_nota",
      data: (_, { codContacto, nuevaNota }) => ({
        codContacto,
        texto: nuevaNota,
        fecha: util.today(),
      }),
      success: "onNotaCreated",
    },
  ],
  onNotaCreated: [
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Nota añadida correctamente",
        tipoMensaje: "success",
      }),
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "nuevaNota", value: "" }),
    },
    {
      type: "grape",
      name: "getNotas",
    },
  ],
  onMostrarHistoricoTratosChanged: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "mostrarHistoricoTratos", value }),
    },
    {
      type: "setStateKey",
      plug: (_, { mostrarHistoricoTratos }) => ({
        path: "tratos.filter.and",
        value: mostrarHistoricoTratos ? [] : [["estado", "not_in", ["Ganado", "Perdido"]]],
      }),
    },
    {
      type: "grape",
      name: "getTratos",
    },
  ],
  onMostrarHistoricoTareasChanged: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "mostrarHistoricoTareas", value }),
    },
    {
      type: "setStateKey",
      plug: (_, { mostrarHistoricoTareas }) => ({
        path: "tareas.filter.and",
        value: mostrarHistoricoTareas ? [] : [["completada", "eq", "false"]],
      }),
    },
    {
      type: "grape",
      name: "getTareas",
    },
  ],
  onTratoEstadoChanged: [
    {
      type: "patch",
      schema: getSchemas().trato,
      id: ({ id }) => id,
      data: ({ estado }) => ({ estado }),
      success: "onTratoUpdated",
    },
  ],
  onTratoUpdated: [
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Trato actualizado correctamente",
        tipoMensaje: "success",
      }),
    },
    {
      type: "grape",
      name: "getTratos",
    },
  ],
  onContactoBufferDatosRevisadosChanged: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({
        path: "contactoBuffer.datosRevisados",
        value,
      }),
    },
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["datosRevisados"] }),
    },
  ],
  onBorrarContactoClicked: [
    {
      type: "userConfirm",
      question: () => ({
        titulo: "¿Borrar contacto?",
        cuerpo: "El contacto seleccionado se eliminará definitivamente",
        textoSi: "CONFIRMAR",
        textoNo: "CANCELAR",
      }),
      onConfirm: "onBorrarContactoConfirmado",
    },
  ],
  onBorrarContactoConfirmado: [
    // {
    //   type: 'function',
    //   function: ({value}) => console.log('mimensaje_',value)
    // },
    {
      type: "delete",
      schema: getSchemas().contacto,
      id: ({ codContacto }) => codContacto,
      success: `onAtrasClicked`,
      error: "errorBorrarContacto",
    },
  ],
  onAtrasClicked: [
    {
      type: "function",
      function: () => window.history.back(),
    },
  ],
  errorBorrarContacto: [
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Error al borrar contacto",
        tipoMensaje: "error",
      }),
    },
  ],
});
