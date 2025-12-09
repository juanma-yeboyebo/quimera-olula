import { getSchemas } from "quimera";
import { DetailAPI, DetailCtrl, MasterAPI, MasterCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  subfamilia: null,
  subfamiliaData: DetailCtrl(getSchemas().recomSubfamilia),
  clientes: MasterCtrl(getSchemas().recomClienteBySubfamilia, { limit: 20 }),
});

export const bunch = parent => ({
  ...parent,
  ...DetailAPI({
    key: "subfamilia",
    name: "subfamiliaData",
    schema: getSchemas().recomSubfamilia,
    action: "get_subfamilias",
    forcePk: true,
  }),
  ...MasterAPI({
    name: "clientes",
    id: "codCliente",
    schema: getSchemas().recomClienteBySubfamilia,
    action: "get_clientes_by_subfamilia",
  }),
  onInit: [
    {
      type: "setStateKey",
      plug: ({ subfamilia }) => ({ path: "subfamilia", value: subfamilia }),
    },
    {
      condition: (_, { subfamilia }) => !!subfamilia,
      type: "grape",
      name: "getSubfamiliaData",
    },
    {
      type: "setStateKey",
      plug: (_, { subfamilia }) => ({
        path: "clientes.filter",
        value: { and: [["codsubfamilia", "eq", subfamilia]] },
      }),
    },
    {
      condition: (_, { subfamilia }) => !!subfamilia,
      type: "grape",
      name: "getClientes",
    },
  ],
});
