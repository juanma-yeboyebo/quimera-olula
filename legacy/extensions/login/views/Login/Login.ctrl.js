// import schemas from './Login.schema'
import { getSchemas, util } from "quimera";
import { InnerDB } from "quimera/lib";

const UserDb = InnerDB.table("user_data");

export const state = parent => ({
  ...parent,
  user: "",
  pass: "",
  email: "",
  autenticando: true,
  autenticado: false,
  error: false,
  loginUser: {
    label: "E-mail",
    icon: "emailrounded",
  },
  onLoginFunc: null,
});

export const bunch = parent => ({
  ...parent,
  onInit: [
    {
      type: "setStateKey",
      plug: payload => ({ path: "onLoginFunc", value: payload.onLogin }),
    },
    {
      type: "grape",
      name: "onWhoami",
    },
  ],
  onWhoami: [
    {
      type: "function",
      function: () => ({ token: util.getUserToken() }),
      success: [
        {
          condition: ({ response }) => response.token,
          type: "get",
          schema: getSchemas().whoami,
          id: () => "-static-",
          params: () => ({
            // clientLogin: util.getEnvironment()?.clientLogin,
            loginType: util.getEnvironment()?.loginType,
          }),
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
      type: "appDispatch",
      name: "setUserData",
      plug: ({ response }) => ({ response }),
    },
    {
      type: "grape",
      name: "setAuthenticationKeys",
    },
    {
      type: "grape",
      name: "goOnLogin",
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
  goOnLogin: [
    // {
    //   condition: (_, { onLoginFunc }) => !!onLoginFunc,
    //   type: 'function',
    //   function: (_payload, { onLoginFunc }) => {
    //     onLoginFunc()
    //   }
    // },
    // {
    //   // condition: (_, { onLoginFunc }) => !!onLoginFunc,
    //   type: 'appDispatch',
    //   name: 'setAuthenticated',
    //   plug: () => ({ authenticated: true })
    // }
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
          name: "goOnLogin",
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
  onEntrarLoginClicked: [
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
      data: (_, { pass, email }) => ({
        password: pass,
        email,
      }),
      success: "onLoginSucceeded",
      error: "onLoginError",
    },
  ],
  onLoginSucceeded: [
    {
      type: "function",
      function: ({ response }) => {
        if (response && Object.prototype.hasOwnProperty.call(response, "user")) {
          util.setUser(response);
          util.setUserToken(response.token);
        }
      },
    },
    {
      type: "grape",
      name: "onWhoami",
    },
    {
      condition: ({ value }) => window.location.href.includes("login"),
      type: "navigate",
      url: () => "/",
    },
  ],
  onLoginError: [
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
