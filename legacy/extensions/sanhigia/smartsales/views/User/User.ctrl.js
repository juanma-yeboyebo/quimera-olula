import { getSchemas, util } from "quimera";
import { DetailAPI, DetailCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  tengoCredenciales: util.getUser().googleapicredentials,
  user: DetailCtrl(getSchemas().miusuario),
  id: null,
});

export const bunch = parent => ({
  ...parent,
  ...DetailAPI({
    name: "user",
    key: "id",
    schema: getSchemas().miusuario,
  }),
  onInit: [
    {
      condition: () => window.location.href.includes("scope"),
      type: "function",
      function: () => {
        // PARA GENERAR UN OBJETO JSON A PARTIR DE LA URL:
        // const params = {};
        // const regex = /([^&=]+)=([^&]*)/g; ---> http://localhost:5173/user#state=pass-through%20value&access_token=ya29.a0...X1l7f6uQ0169&token_type=Bearer&expires_in=3599&scope=https://www.googleapis.com/auth/calendar
        // const regex = /([^&?=]+)=([^&]*)/g; ---> http://localhost:5173/user?state=zbF...v8Sm0&code=4/0AQ...FdM3fBhQ&scope=https://www.googleapis.com/auth/calendar
        // let m;
        // const accessToken = null;

        // while ((m = regex.exec(location.href))) {
        //   params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        // }

        // if (Object.keys(params).length > 0) {
        //   console.log("mimensaje_datos_del_response", params);
        //   accessToken = params["access_token"];
        // }

        const authorizationResponse = window.location.href;
        // //Oculta el access_token de la url
        window.history.pushState({}, document.title, "/user");

        return { authorizationResponse };
      },
      success: [
        {
          type: "grape",
          name: "generaTokenGoogle",
        },
      ],
    },
    // No tengo 'get' en usuarios_api
    // {
    //   type: "setStateKeys",
    //   plug: () => ({
    //     keys: {
    //       id: util.getUser().user,
    //     },
    //   }),
    // },
    // {
    //   type: "grape",
    //   name: "getUser",
    // },
  ],
  onGetUserSucceded: [
    {
      type: "function",
      function: (_, { user }) => console.log("mimensaje_user", user),
    },
    // {
    //   type: "grape",
    //   name: "cargaBufferUser",
    // },
  ],
  onActivarGoogleCalendarClicked: [
    {
      type: "patch",
      schema: getSchemas().googlecalendar,
      id: () => "-static-",
      action: "authenticate",
      success: "urlAutenticacionGenerada",
      error: "urlAutenticacionError",
    },
  ],
  generaTokenGoogle: [
    {
      type: "patch",
      schema: getSchemas().googlecalendar,
      id: () => "-static-",
      action: "genera_refresh_token",
      data: ({ response }) => ({
        authorization_response: response.authorizationResponse,
      }),
      success: "recargaCacheUsuario",
      // error: "onLoginAdminError",
    },
  ],
  urlAutenticacionGenerada: [
    {
      condition: ({ response }) => !!response.url && response.url !== "refresh_token",
      type: "navigate",
      url: ({ response }) => response.url,
    },
    {
      condition: ({ response }) => !!response.url && response.url === "refresh_token",
      type: "showMessage",
      plug: () => ({
        mensaje: "Renovados permisos para acceder a Google Calendar",
        tipoMensaje: "success",
      }),
    },
  ],
  urlAutenticacionError: [
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Error al autenticar con Google Calendar",
        tipoMensaje: "error",
      }),
    },
  ],
  recargaCacheUsuario: [
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
            loginType: util.getEnvironment()?.loginType,
          }),
          action: "whoami",
          success: "onWhoamiSucceeded",
          error: "onWhoamiError",
        },
      ],
    },
  ],
  onWhoamiSucceeded: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({ path: "tengoCredenciales", value: response.googleapicredentials }),
    },
    {
      type: "appDispatch",
      name: "setUserData",
      plug: ({ response }) => ({ response }),
    },
  ],
});
