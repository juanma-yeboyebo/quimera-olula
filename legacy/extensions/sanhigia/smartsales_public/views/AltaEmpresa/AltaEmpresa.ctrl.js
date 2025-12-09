import { getSchemas, util } from "quimera";

export const state = parent => ({
  ...parent,
  empresa: {
    nombre: null,
    email: null,
    pass: null,
  },
});

export const bunch = parent => ({
  ...parent,
  onNuevaEmpresaClicked: [
    {
      condition: (_, { empresa }) => getSchemas().nuevaEmpresa.isValid(empresa),
      type: "post",
      schema: getSchemas().nuevaEmpresa,
      data: (_, { empresa }) => ({ ...empresa }),
      action: "create",
      success: "onEmpresaCreated",
    },
    {
      condition: (_, { empresa }) => !getSchemas().nuevaEmpresa.isValid(empresa),
      type: "showMessage",
      plug: () => ({
        mensaje: "Debe rellenar el formulario completo",
        tipoMensaje: "warning",
      }),
    },
  ],
  onEmpresaCreated: [
    {
      type: "showMessage",
      plug: (_, { empresa }) => ({
        mensaje: `Compañía ${empresa.nombre} creada correctamente`,
        tipoMensaje: "success",
      }),
    },
    {
      type: "navigate",
      url: () => util.getEnvironment().getUrlDict().smartSales,
    },
  ],
});
