import { getSchemas, util } from "quimera";
import { DetailAPI, DetailCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  idTrato: null,
  trato: DetailCtrl(getSchemas().trato),
  modalCrearContactoVisible: false,
  callbackCerrado: null,
  idCampania: null,
  idTipoTrato: null,
  valorTrato: 0,
  guardandoTrato: false,
  notasColaboracion: [
    { id: 0, titulo: "Valoración general del ponente:", contenido: null },
    {
      id: 1,
      titulo:
        "Valoración de la implicación del ponente con nuestros productos y líneas de producto que usa el ponente:",
      contenido: null,
    },
    { id: 2, titulo: "Valoración del potencial de ventas del evento:", contenido: null },
  ],
});

export const bunch = parent => ({
  ...parent,
  ...DetailAPI({
    name: "trato",
    key: "idTrato",
    schema: getSchemas().trato,
  }),
  onInit: [
    {
      type: "setStateKey",
      plug: ({ idContacto }) => ({ path: "trato.contacto", value: idContacto }),
    },
    {
      type: "grape",
      name: "setNuevoTrato",
    },
  ],
  setNuevoTrato: [
    {
      type: "setStateKeys",
      plug: ({ callbackCerrado, codCliente, idCampania, idTipoTrato, valorTrato }, { trato }) => ({
        keys: {
          trato: {
            ...trato,
            estadoAsigAgente: idCampania ? "Sin Agente" : "Publicado",
            cliente: codCliente,
            idCampania,
            idTipotrato: idTipoTrato,
            valor: valorTrato,
            fecha: util.today(),
            horaAlta: util.now(),
          },
          callbackCerrado,
        },
      }),
    },
  ],
  onTratoSaved: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({ path: "trato.idTrato", value: response.pk }),
    },
    {
      condition: (_, { trato }) => util.getUser().tratocolaboracion === trato.idTipotrato,
      type: "grape",
      name: "crearNotasAsociadas",
    },
    {
      condition: (_, { trato }) => util.getUser().tratocolaboracion !== trato.idTipotrato,
      type: "grape",
      name: "continuarTratoGuardado",
    },
  ],
  crearNotasAsociadas: [
    {
      type: "post",
      action: "add_notas",
      id: () => "-static-",
      schema: getSchemas().notasTrato,
      data: (_, { trato, notasColaboracion }) => ({
        idTrato: trato.idTrato,
        codContacto: trato.contacto,
        notas: notasColaboracion.map(nota => ({
          contenido: `${nota.titulo} ${nota.contenido}`,
        })),
      }),
      success: "continuarTratoGuardado",
    },
  ],
  limpiarNotasColaboracion: [
    {
      type: "function",
      function: (_, { notasColaboracion }) => {
        const auxNotas = [];
        for (let i = 0; i < notasColaboracion.length; i++) {
          auxNotas.push(notasColaboracion[i]);
          auxNotas[i].contenido = null;
        }

        return { auxNotas };
      },
      success: [
        {
          type: "setStateKey",
          plug: ({ response }) => ({ path: "notasColaboracion", value: response.auxNotas }),
        },
      ],
    },
  ],
  continuarTratoGuardado: [
    {
      type: "grape",
      name: "limpiarNotasColaboracion",
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "guardandoTrato", value: false }),
    },
    {
      type: "showMessage",
      plug: () => ({ mensaje: "Trato creado", tipoMensaje: "success" }),
    },
    {
      condition: (_, { idCampania }) => !idCampania,
      type: "grape",
      name: "buscarAsociado",
      plug: (_, { trato }) => ({ idTrato: trato.idTrato }),
    },
  ],
  buscarAsociado: [
    {
      condition: (_, { trato }) => !!trato.contacto,
      type: "post",
      schema: getSchemas().contactosAgente,
      data: (_, { trato }) => ({
        contacto: trato.contacto,
        agente: util.getGlobalSetting("user_data").user.agente,
      }),
      action: "are_associated",
      success: "onAssociatedReceived",
    },
    {
      condition: (_, { trato }) => !trato.contacto,
      type: "grape",
      name: "redireccionCrearTratoTerminado",
      plug: (_, { trato }) => ({ idTrato: trato.idTrato }),
    },
  ],
  onAssociatedReceived: [
    {
      condition: ({ response }) =>
        !response.data.length &&
        !(util.getUser().group === "MKT" || util.getUser().group === "Responsable de marketing"),
      type: "userConfirm",
      question: () => ({
        titulo: "Asociación de contactos",
        cuerpo: "No tiene el contacto asociado a su lista. ¿Desea asociarlo?",
        textoSi: "ASOCIAR",
        textoNo: "CANCELAR",
      }),
      onConfirm: "onAsociarContratoConfirmed",
      onCancel: "redireccionCrearTratoTerminado",
      plug: ({ response, idTrato }) => ({
        contacto: response.email,
        idTrato,
      }),
    },
    {
      condition: ({ response }) =>
        !!response.data.length ||
        util.getUser().group === "MKT" ||
        util.getUser().group === "Responsable de marketing",
      type: "grape",
      name: "redireccionCrearTratoTerminado",
    },
  ],
  onAsociarContratoConfirmed: [
    {
      type: "post",
      schema: getSchemas().contactosAgente,
      data: ({ contacto }) => ({
        contacto,
        agente: util.getGlobalSetting("user_data").user.agente,
      }),
      success: [],
    },
    {
      type: "grape",
      name: "redireccionCrearTratoTerminado",
    },
  ],
  onConfirmarClicked: [
    {
      type: "setStateKey",
      plug: () => ({ path: "guardandoTrato", value: true }),
    },
    {
      type: "grape",
      name: "onSaveTratoClicked",
    },
  ],
  onSaveTratoFailed: [
    {
      type: "setStateKey",
      plug: () => ({ path: "guardandoTrato", value: false }),
    },
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "No se pudo crear el trato",
        tipoMensaje: "error",
      }),
    },
  ],
  onCrearNuevoContactoClicked: [
    {
      type: "setStateKey",
      plug: () => ({ path: "modalCrearContactoVisible", value: true }),
    },
  ],
  onCerrarCrearContacto: [
    {
      condition: ({ response }) => !!response?.pk,
      type: "grape",
      name: "onTratoContactoChanged",
      plug: ({ response }) => ({ field: "trato.contacto", value: response.pk }),
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "modalCrearContactoVisible", value: false }),
    },
  ],
  redireccionCrearTratoTerminado: [
    {
      condition: (_, { callbackCerrado, trato }) => !trato.idCampania && !callbackCerrado,
      type: "navigate",
      url: ({ idTrato }) => `/ss/trato/${idTrato}`,
    },
    {
      condition: (_, { callbackCerrado, idCampania }) => !!callbackCerrado,
      type: "grape",
      name: "onNuevoTratoGuardado",
    },
  ],
  onNuevoTratoGuardado: [
    {
      type: "function",
      function: (payload, { callbackCerrado, trato, idTrato }) => callbackCerrado(trato, idTrato),
    },
  ],
  onTratoCodFamiliaChanged: [
    {
      type: "setStateKey",
      plug: ({ option }, { trato }) => {
        const auxFamilias = [];
        trato.familias.forEach(familia => auxFamilias.push(familia));
        auxFamilias.push(option);

        return { path: "trato.familias", value: auxFamilias };
      },
    },
  ],
  onDeleteFamiliaProductoClicked: [
    {
      type: "setStateKey",
      plug: ({ indice }, { trato }) => {
        const auxFamilias = [];
        trato.familias.forEach(familia => auxFamilias.push(familia));
        auxFamilias.splice(indice, 1);

        return { path: "trato.familias", value: auxFamilias };
      },
    },
  ],
  onTratoClienteChanged: [
    {
      type: "setStateKey",
      plug: ({ field, value }) => ({ path: field, value }),
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "trato.contacto", value: undefined }),
    },
  ],
  onNotaColaboracionChanged: [
    {
      type: "function",
      function: ({ index, value }, { notasColaboracion }) => {
        const auxNotas = [];

        for (let i = 0; i < notasColaboracion.length; i++) {
          auxNotas.push(notasColaboracion[i]);
          if (i === index) {
            auxNotas[i].contenido = value;
          }
        }

        return { auxNotas };
      },
      success: [
        {
          type: "setStateKey",
          plug: ({ response }) => ({ path: "notasColaboracion", value: response.auxNotas }),
        },
      ],
    },
  ],
});
