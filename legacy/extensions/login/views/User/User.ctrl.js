import { getSchemas } from "quimera";
import { DetailAPI, DetailCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
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
  // No tengo 'get' en usuarios_api
  // onInit: [
  //   {
  //     type: "setStateKeys",
  //     plug: () => ({
  //       keys: {
  //         id: util.getUser().user,
  //       },
  //     }),
  //   },
  //   {
  //     type: "grape",
  //     name: "getUser",
  //   },
  // ],
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
});
