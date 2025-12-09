import { getSchemas, util } from "quimera";

export const state = parent => ({
  ...parent,
  loginType: null,
});

export const bunch = parent => ({
  ...parent,
  onInit: [
    {
      log: () => ["ON WHOAMI"],
      type: "setStateKey",
      plug: ({ loginType }) => ({ path: "loginType", value: loginType }),
    },
    ...parent.onInit,
  ],
  onWhoami: [
    {
      log: () => ["ON WHOAMI"],
      condition: (_, { loginType }) => loginType !== "customer",
      type: "function",
      function: () => ({ token: util.getUserToken() }),
      success: [
        {
          condition: ({ response }) => response.token,
          log: ({ response }) => ["HAY TOKEN", response.token],
          type: "get",
          schema: getSchemas().whoami,
          id: () => "-static-",
          params: () => {
            const user = util.getUser();

            return {
              admin: user && user.superuser,
              // clientLogin: util.getEnvironment()?.clientLogin,
              loginType: util.getEnvironment()?.loginType,
            };
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
        {
          condition: ({ response }) => !response.token,
          log: ({ response }) => ["NO HAY TOKEN", response.token],
          type: "grape",
          name: "guestAutoLogin",
          // plug: () => ({ authenticated: false })
        },
      ],
    },
    {
      condition: (_, { loginType }) => loginType === "customer",
      type: "grape",
      name: "onCheckAuthentication",
    },
  ],
  // onCheckAuthentication: [
  //   {
  //     condition: (_, { loginType }) => loginType !== 'customer',
  //     type: 'setStateKey',
  //     plug: ({ authenticated }) => ({
  //       path: 'autenticando',
  //       value: authenticated
  //     })
  //   },
  //   {
  //     condition: (_, { loginType }) => loginType === 'customer',
  //     type: 'grape',
  //     name: 'guestAutoLogin'
  //   }
  // ],
  // onCheckAuthentication: [
  //   {
  //     type: "setStateKey",
  //     plug: ({ authenticated }) => ({
  //       path: "autenticando",
  //       value: authenticated,
  //     }),
  //   },
  //   {
  //     condition: (_, { loginType }) => loginType === 'customer',
  //     type: 'grape',
  //     name: 'guestAutoLogin'
  //   }
  // ],
  onGuestClicked: [
    {
      type: "grape",
      name: "guestAutoLogin",
    },
  ],
  guestAutoLogin: [
    {
      type: "setStateKeys",
      plug: () => ({
        keys: {
          pass: "guest",
          email: "guest",
        },
      }),
    },
    {
      type: "grape",
      name: "onEntrarLoginClicked",
    },
  ],
  onLoginSucceeded: [
    ...parent.onLoginSucceeded,
    {
      condition: (_, { loginType }) => loginType === "customer",
      type: "appDispatch",
      name: "setUserData",
      plug: ({ response }) => ({ response }),
    },
    {
      condition: (_, { loginType }) => loginType === "customer",
      type: "redirect",
      url: () => "/",
    },
    // {
    //   log: () => ['GET CARRITO ACTIVO LOGIN'],
    //   // condition: (_, { loginType }) => loginType === 'customer',
    //   type: 'appDispatch',
    //   name: 'getCarritoActivo'
    // },
  ],
  onWhoamiSucceeded: [
    ...parent.onWhoamiSucceeded,
    // {
    //   log: () => ['GET CARRITO ACTIVO'],
    //   // condition: (_, { loginType }) => loginType === 'customer',
    //   type: 'appDispatch',
    //   name: 'getCarritoActivo'
    // },
  ],
});
