import { getSchemas, util } from "quimera";
import { InnerDB } from "quimera/lib";

import schemas from "./LoginAdmin.schema";

const UserDb = InnerDB.table("user_data");

export const state = parent => ({
  ...parent,
  user: null,
  pass: null,
  autenticando: true,
  autenticado: false,
  error: false,
  loginUser: {
    label: "Usuario",
    icon: "person",
  },
  // onLoginAdminFunc: null,
});

export const bunch = parent => ({
  ...parent,
  onInit: [
    // {
    //   type: 'setStateKey',
    //   plug: (payload) => ({ path: 'onLoginAdminFunc', value: payload.onLogin })
    // },
    // {
    //   type: 'grape',
    //   name: 'onWhoami'
    // }
  ],
  onWhoami: [
    {
      type: "function",
      function: () => ({ token: util.getUserToken() }),
      success: [
        {
          condition: ({ response }) => response.token,
          type: "get",
          schema: schemas.whoami,
          id: () => "-static-",
          params: () => {
            const user = util.getUser();

            return user && user.superuser ? { admin: true } : {};
          },
          action: "whoami",
          success: "onWhoamiSucceeded",
          error: "onWhoamiError",
        },
        {
          condition: ({ response }) => !response.token,
          type: "grape",
          name: "onCheckAuthentication",
          plug: () => ({ authenticated: false }),
        },
      ],
    },
  ],
  onWhoamiSucceeded: [
    {
      type: "grape",
      name: "setUserData",
    },
    {
      type: "grape",
      name: "setAuthenticationKeys",
    },
    {
      type: "grape",
      name: "goOnLoginAdmin",
    },
  ],
  setAuthenticationKeys: [
    {
      type: "setStateKeys",
      plug: () => ({
        keys: {
          autenticado: true,
          autenticando: false,
          error: false,
        },
      }),
    },
  ],
  setUserData: [
    {
      type: "function",
      function: ({ response }) => {
        util.setUser(response);
        UserDb.updateRecord("user", response);
      },
    },
  ],
  goOnLoginAdmin: [
    {
      condition: (_, { onLoginAdminFunc }) => !!onLoginAdminFunc,
      type: "function",
      function: (_payload, { onLoginAdminFunc }) => {
        onLoginAdminFunc();
      },
    },
  ],
  onWhoamiError: [
    {
      type: "function",
      function: () => ({ user: UserDb.readRecord("user") }),
      success: [
        {
          condition: ({ response }) => !!Object.keys(response.user).length,
          type: "function",
          function: ({ response }) => util.setUser(response.user),
        },
        {
          condition: ({ response }) => !!Object.keys(response.user).length,
          type: "grape",
          name: "goOnLoginAdmin",
        },
      ],
    },
    {
      type: "setStateKeys",
      plug: () => ({
        keys: {
          autenticado: false,
          autenticando: false,
          error: "Ha ocurrido un problema al recuperar el usuario y debes identificarte de nuevo",
        },
      }),
    },
  ],
  onCheckAuthentication: [
    {
      type: "setStateKey",
      plug: ({ authenticated }) => ({
        path: "autenticando",
        value: authenticated,
      }),
    },
  ],
  onEntrarLoginAdminClicked: [
    {
      type: "setStateKey",
      plug: () => ({
        path: "error",
        value: false,
      }),
    },
    {
      type: "post",
      schema: getSchemas().login,
      // action: 'login_admin',
      data: (_, { pass, user }) => ({
        password: pass,
        email: user,
        admin: true,
      }),
      success: "onLoginAdminSucceeded",
      error: "onLoginAdminError",
    },
  ],
  onLoginAdminSucceeded: [
    {
      log: ({ response }) => ["responseLOGINADMIN0", response],
      type: "function",
      function: ({ response }) => {
        if (response && Object.prototype.hasOwnProperty.call(response, "user")) {
          util.setUser(response);
          util.setUserToken(response.token);
        }
      },
    },
    {
      // Cambiar por /admin/home cuando haya una home de administración
      type: "navigate",
      url: () => "/",
    },
  ],
  onLoginAdminError: [
    {
      type: "setStateKeys",
      plug: () => ({
        keys: {
          autenticado: false,
          autenticando: false,
          error: "Las credenciales proporcionadas no son correctas",
        },
      }),
    },
  ],
  onSnackbarAutoHide: [
    {
      condition: payload => payload.reason !== "clickaway",
      type: "setStateKey",
      plug: () => ({
        path: "error",
        value: false,
      }),
    },
  ],
});
