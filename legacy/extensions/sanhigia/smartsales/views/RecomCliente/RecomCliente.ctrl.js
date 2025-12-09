import { getSchemas } from "quimera";
import { DetailAPI, DetailCtrl, MasterAPI, MasterCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  cliente: null,
  direccion: null,
  clienteData: DetailCtrl(getSchemas().recomCliente),
  subfamilias: MasterCtrl(getSchemas().recomSubfamiliaByCliente, { limit: 20 }),
});

export const bunch = parent => ({
  ...parent,
  ...DetailAPI({
    key: "direccion",
    name: "clienteData",
    schema: getSchemas().recomCliente,
    action: "get_clientes",
    forcePk: true,
  }),
  ...MasterAPI({
    name: "subfamilias",
    id: "codsubfamilia",
    schema: getSchemas().recomSubfamiliaByCliente,
    action: "get_subfamilias_by_cliente",
  }),
  onInit: [
    {
      type: "setStateKeys",
      plug: ({ cliente, direccion }) => ({ keys: { cliente, direccion } }),
    },
    {
      condition: (_, { cliente, direccion }) => !!cliente && !!direccion,
      type: "grape",
      name: "getClienteData",
    },
    {
      type: "setStateKey",
      plug: (_, { cliente, direccion }) => ({
        path: "subfamilias.filter",
        value: {
          and: [
            ["codcliente", "eq", cliente],
            ["coddir", "eq", direccion],
          ],
        },
      }),
    },
    {
      condition: (_, { cliente, direccion }) => !!cliente && !!direccion,
      type: "grape",
      name: "getSubfamilias",
    },
  ],
});
