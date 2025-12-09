import { getSchemas } from "quimera";
import { DetailAPI, DetailCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  estadoEmail: null,
  codContacto: null,
  contacto: DetailCtrl(getSchemas().contacto),
  callbackCerrado: null,
});

export const bunch = parent => ({
  ...parent,
  ...DetailAPI({
    name: "contacto",
    key: "codContacto",
    schema: getSchemas().contacto,
  }),
  onInit: [
    {
      log: (a, b) => ["milog", a, b],
      type: "setStateKey",
      plug: ({ callbackCerrado }) => ({ path: "callbackCerrado", value: callbackCerrado }),
    },
    {
      condition: ({ codCliente }) => !!codCliente,
      type: "setStateKey",
      plug: ({ codCliente }) => ({ path: "contacto.cliente", value: codCliente }),
    },
  ],
  onContactoSaved: [
    {
      type: "showMessage",
      plug: () => ({ mensaje: "Contacto creado", tipoMensaje: "success" }),
    },
    {
      condition: (_, { callbackCerrado }) => !callbackCerrado,
      type: "navigate",
      url: ({ response }) => `/ss/contacto/${response.pk}`,
    },
    {
      condition: (_, { callbackCerrado }) => !!callbackCerrado,
      type: "grape",
      name: "onNuevoContactoGuardado",
    },
  ],
  onSaveContactoFailed: [
    {
      type: "showMessage",
      plug: () => ({ mensaje: "No se pudo crear el contacto", tipoMensaje: "error" }),
    },
  ],
  onNuevoContactoGuardado: [
    {
      type: "function",
      function: (payload, { callbackCerrado }) => callbackCerrado(payload),
    },
  ],
  onContactoEmailChanged: [
    {
      type: "setStateKey",
      plug: ({ value }, { contacto }) => ({
        path: "contacto",
        value: { ...contacto, email: value, codContacto: null },
      }),
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "estadoEmail", value: "comprobando" }),
    },
  ],
  setEmailInvalido: [
    {
      type: "setStateKey",
      plug: () => ({ path: "estadoEmail", value: "invalido" }),
    },
  ],
  checkEmail: [
    {
      type: "get",
      schema: getSchemas().contacto,
      filter: ({ value }) => ["email", "eq", value],
      success: "onEmailCheckedSucceded",
    },
  ],
  onEmailCheckedSucceded: [
    {
      condition: ({ response }) => response?.data?.length > 0,
      type: "setStateKeys",
      plug: ({ response }, { contacto }) => ({
        keys: {
          estadoEmail: "validoYaExisite",
          contacto: { ...contacto, codContacto: response.data[0].codContacto },
        },
      }),
    },
    {
      condition: ({ response }) => response?.data?.length === 0,
      type: "setStateKey",
      plug: () => ({ path: "estadoEmail", value: "validoNoExisite" }),
    },
  ],
});
