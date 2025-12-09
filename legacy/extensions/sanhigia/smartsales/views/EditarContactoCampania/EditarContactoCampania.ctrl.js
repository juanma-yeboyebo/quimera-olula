import { getSchemas, util } from "quimera";
import { DetailAPI, DetailCtrl, MasterAPI, MasterCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  codContacto: null,
  idContactoCampania: null,
  refreshCallback: null,
  contactoBuffer: {},
  nuevaNota: "",
  noEncontrado: false,
  contacto: DetailCtrl(getSchemas().contacto),
  notas: MasterCtrl(getSchemas().notaContacto),
  contactosPorCampania: DetailCtrl(getSchemas().contactosPorCampania),
  callbackCerrado: null,
});

export const bunch = parent => ({
  ...parent,
  ...DetailAPI({
    name: "contacto",
    key: "codContacto",
    schema: getSchemas().contacto,
  }),
  ...MasterAPI({
    name: "notas",
    key: "idNota",
    schema: getSchemas().notaContacto,
    action: "get_notas",
  }),
  ...DetailAPI({
    name: "contactosPorCampania",
    key: "idContacto",
    schema: getSchemas().contactosPorCampania,
  }),
  onInit: [
    {
      type: "setStateKey",
      plug: ({ idContacto }) => ({ path: "codContacto", value: idContacto }),
    },
    {
      type: "setStateKey",
      plug: ({ idContactoCampania }) => ({
        path: "idContacto",
        value: idContactoCampania,
      }),
    },
    {
      type: "setStateKey",
      plug: ({ callbackCerrado }) => ({ path: "callbackCerrado", value: callbackCerrado }),
    },
    {
      type: "setStateKey",
      plug: ({ refreshCallback }) => ({ path: "refreshCallback", value: refreshCallback }),
    },
    {
      type: "grape",
      name: "getContacto",
    },
    {
      type: "grape",
      name: "getContactosPorCampania",
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
    {
      type: "grape",
      name: "refreshCallback",
    },
  ],
  refreshCallback: [
    {
      // log: (_, { contacto }) => ["mimensaje_refreshCallback", contacto],
      type: "function",
      function: (_, { refreshCallback, contacto }) => refreshCallback && refreshCallback(contacto),
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
  onEditarContactoGuardado: [
    {
      log: (payload, state) => [payload, state],
      type: "function",
      function: (payload, { callbackCerrado }) => callbackCerrado(payload),
    },
  ],
});
