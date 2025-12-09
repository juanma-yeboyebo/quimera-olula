import { getSchemas } from "quimera";
import { ModelAPI, ModelCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  users: ModelCtrl(getSchemas().user),
  usersBuffer: {},
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "users",
    id: "id",
    schema: getSchemas().user,
    url: "/users",
  }),
  onInit: [
    {
      type: "grape",
      name: "getUsers",
    },
  ],
  onGetUsersSucceded: [
    {
      type: "grape",
      name: "cargaBufferUser",
    },
  ],
  onAtrasClicked: [
    {
      type: "navigate",
      url: () => "/users",
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "users.current", value: null }),
    },
  ],
  onIdUsersChanged: [
    {
      type: "grape",
      name: "cargaBufferUser",
    },
  ],
  cargaBufferUser: [
    {
      condition: (_payload, { users }) => users.current,
      type: "setStateKey",
      plug: (_payload, { users }) => ({
        path: "usersBuffer",
        value: { ...users.dict[users.current] },
      }),
    },
  ],
  onSeccionConfirmada: [
    {
      type: "setStateKey",
      plug: ({ fields }, { users, usersBuffer }) => ({
        path: "users.dict",
        value: {
          ...users.dict,
          [users.current]: fields.reduce(
            (accum, item) => ({ ...accum, [item]: usersBuffer[item] }),
            users.dict[users.current],
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
      condition: (_, { users }) => !!users.current,
      type: "patch",
      schema: getSchemas().user,
      id: (_, { users }) => users.current,
      data: ({ fields }, { users }) =>
        fields.reduce((accum, key) => ({ ...accum, [key]: users.dict[users.current][key] }), {}),
      success: "onUserUpdated",
    },
  ],
  onUserUpdated: [
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Usuario actualizado correctamente",
        tipoMensaje: "success",
      }),
    },
  ],
  onSeccionCancelada: [
    {
      type: "setStateKey",
      plug: ({ fields }, { users, usersBuffer }) => ({
        path: "usersBuffer",
        value: {
          ...usersBuffer,
          ...fields.reduce(
            (accum, item) => ({
              ...accum,
              [item]: users.dict[users.current][item],
            }),
            usersBuffer,
          ),
        },
      }),
    },
  ],
  onNombreSeccionConfirmada: [
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["id", "nombre"] }),
    },
  ],
  onNombreSeccionCancelada: [
    {
      type: "grape",
      name: "onSeccionCancelada",
      plug: () => ({ fields: ["id", "nombre"] }),
    },
  ],
  onEmailSeccionConfirmada: [
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["email"] }),
    },
  ],
  onEmailSeccionCancelada: [
    {
      type: "grape",
      name: "onSeccionCancelada",
      plug: () => ({ fields: ["email"] }),
    },
  ],
  onUsersBufferIdgroupChanged: [
    {
      type: "setStateKey",
      plug: payload => ({
        path: "usersBuffer.idgroup",
        value: payload.value,
      }),
    },
    {
      condition: (_, { users }) => users.current !== "nuevo",
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["idgroup"] }),
    },
  ],
  onEliminarUsuarioSeccionConfirmada: [
    {
      type: "delete",
      schema: getSchemas().user,
      id: (_, { users }) => users.current,
      success: "onUserDeleted",
    },
  ],
  onUserDeleted: [
    {
      type: "grape",
      name: "onAtrasClicked",
    },
    {
      type: "grape",
      name: "getUsers",
    },
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Usuario eliminado correctamente",
        tipoMensaje: "success",
      }),
    },
  ],
  onNuevoUsuarioClicked: [
    {
      type: "grape",
      name: "onUsersClicked",
      plug: _p => ({ item: { id: "nuevo" } }),
    },
  ],
  onGuardarNuevoUsuarioClicked: [
    {
      type: "post",
      schema: getSchemas().user,
      data: (_, { usersBuffer }) => usersBuffer,
      success: "onNuevoUsuarioGuardado",
    },
  ],
  onNuevoUsuarioGuardado: [
    {
      type: "showMessage",
      plug: (_, { usersBuffer }) => ({
        mensaje: `Usuario ${usersBuffer.id} creado correctamente`,
        tipoMensaje: "success",
      }),
    },
    {
      type: "grape",
      name: "getUsers",
    },
    {
      type: "navigate",
      url: (_, { usersBuffer }) => `/users/${usersBuffer.id}`,
    },
  ],
});
