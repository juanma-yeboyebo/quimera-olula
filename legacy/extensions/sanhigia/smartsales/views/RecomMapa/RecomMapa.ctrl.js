import { getSchemas } from "quimera";
import { MasterAPI, MasterCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  clientes: [],
  productos: MasterCtrl(getSchemas().recomClienteBySubfamilia, {
    limit: 10000,
  }),
  subfamilia: null,
});

export const bunch = parent => ({
  ...parent,
  ...MasterAPI({
    name: "productos",
    id: "coddir",
    schema: getSchemas().recomClienteBySubfamilia,
    action: "get_all_recom",
  }),
  onInit: [
    {
      type: "setStateKeys",
      plug: ({ subfamilia, clientes }) => ({
        keys: {
          subfamilia,
          clientes,
        },
      }),
    },
    {
      type: "grape",
      name: "getRecom",
    },
  ],
  getRecom: [
    {
      type: "setStateKey",
      plug: (_, { subfamilia, clientes, productos }) => ({
        path: "productos",
        value: {
          ...productos,
          list: clientes.length ? productos.list : [],
          filter: {
            and: [
              ["codcliente", "in", clientes?.map(cli => cli.codCliente.toString())],
              ["coddir", "in", clientes?.map(cli => cli.codDir)],
              ["codsubfamilia", "in", [subfamilia]],
            ],
          },
        },
      }),
    },
    {
      condition: (_, { subfamilia, clientes }) => !!clientes.length && !!subfamilia,
      type: "grape",
      name: "getProductos",
    },
  ],
});
