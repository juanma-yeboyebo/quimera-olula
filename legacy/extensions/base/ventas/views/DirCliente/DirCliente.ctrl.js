import schemas from "../../static/schemas";

export const state = parent => ({
  ...parent,
  direccion: schemas.dirClientes.load({}),
  // modo: 'ver',
  // callbackGuardada: null,
  bloqueada: true,
  // direccionInicial: {},
  direccionValida: false,
  // focused: false
});

export const bunch = parent => ({
  onInit: [
    {
      type: "grape",
      grape: "cargaDireccion",
    },
    // {
    //   type: 'setStateKey',
    //   plug: ({ callbackGuardada }) => ({ path: 'callbackGuardada', value: callbackGuardada })
    // },
    // {
    //   type: 'setStateKey',
    //   plug: ({ docDireccion }) => ({ path: 'direccionInicial', value: docDireccion })
    // }
  ],
  cargaDireccion: [
    {
      type: "setStateKey",
      plug: ({ docDireccion }) => ({
        path: "direccion",
        value: {
          codDir: docDireccion.codDir,
          direccion: docDireccion.direccion,
          ciudad: docDireccion.ciudad,
          provincia: docDireccion.provincia,
          codPais: docDireccion.codpais,
          codPostal: docDireccion.codPostal,
          dirTipoVia: docDireccion.dirTipoVia,
          dirOtros: docDireccion.dirOtros,
          dirNum: docDireccion.dirNum,
        },
      }),
    },
    {
      type: "grape",
      name: "checkDireccionValida",
    },
  ],
  checkDireccionValida: [
    {
      type: "setStateKey",
      plug: (payload, { direccion }) => ({
        path: "direccionValida",
        value: direccion.codDir || (direccion.direccion && direccion.ciudad),
      }),
    },
  ],
  // onEditarClicked: [
  //   {
  //     type: 'setStateKey',
  //     plug: (payload, { direccion }) => ({ path: 'bloqueada', value: direccion.codDir })
  //   },
  //   {
  //     type: 'setStateKey',
  //     plug: () => ({ path: 'modo', value: 'editar' })
  //   }
  // ],
  // onGuardarClicked: [
  //   {
  //     type: 'function',
  //     function: (payload, { callbackGuardada, direccion }) => callbackGuardada && callbackGuardada({ direccion })
  //   },
  //   {
  //     type: 'setStateKey',
  //     plug: () => ({ path: 'modo', value: 'ver' })
  //   }
  // ],
  onDireccionCodDirChanged: [
    {
      type: "grape",
      grape: "cargaDireccion",
      plug: ({ direccion }) => ({ docDireccion: { ...direccion } }),
    },
  ],
  onDireccionChanged: [
    {
      type: "grape",
      grape: "cargaDireccion",
      plug: ({ field, value }, { direccion }) => ({
        docDireccion: { ...direccion, [field]: value },
      }),
    },
  ],
  // onCerrarClicked: [
  //   {
  //     type: 'grape',
  //     grape: 'cargaDireccion',
  //     plug: (payload, { direccionInicial }) => ({ docDireccion: direccionInicial })
  //   },
  //   {
  //     log: () => 'ON CERRAR CLICKED',
  //     type: 'setStateKey',
  //     plug: () => ({ path: 'modo', value: 'ver' })
  //   }
  // ],
  onBloquearClicked: [
    {
      type: "setStateKey",
      plug: (payload, { bloqueada }) => ({ path: "bloqueada", value: !bloqueada }),
    },
    {
      condition: (payload, { bloqueada }) => !bloqueada,
      type: "setStateKey",
      plug: payload => ({ path: "direccion.codDir", value: null }),
    },
  ],
  // onKeyPressed: [
  //   {
  //     condition: ({ event }, { modo }) => event.key === 'Enter',
  //     type: 'grape',
  //     name: 'onEditarClicked'
  //   },
  // ],
  // onFocus: [
  //   {
  //     type: 'setStateKey',
  //     plug: ({ focused }) => ({ path: 'focused', value: focused })
  //   },
  // ]
});
