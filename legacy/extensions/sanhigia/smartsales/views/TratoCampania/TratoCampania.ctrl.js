import { getSchemas, util } from "quimera";
import { DetailAPI, DetailCtrl, MasterAPI, MasterCtrl, ModelAPI, ModelCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  asociandoPedido: false,
  idTrato: null,
  refreshCallback: null,
  deletedCallback: null,
  tratoBuffer: {},
  nuevaNota: "",
  noEncontrado: false,
  trato: DetailCtrl(getSchemas().tratoCampania),
  tareas: ModelCtrl(getSchemas().tarea, { limit: 7 }),
  notas: MasterCtrl(getSchemas().notaTrato),
  contactosPorCampania: DetailCtrl(getSchemas().contactosPorCampania),
  contactoTrato: DetailCtrl(getSchemas().contacto),
  modalAsociarPedidoVisible: false,
  modalEditarContactoVisible: false,
  modalResolverDiferenciasVisible: false,
  refrescarContacto: false,
});

export const bunch = parent => ({
  ...parent,
  ...DetailAPI({
    name: "trato",
    key: "idTrato",
    schema: getSchemas().tratoCampania,
    forcePk: true,
    action: "get_for_campania",
  }),
  ...ModelAPI({
    name: "tareas",
    id: "idTarea",
    schema: getSchemas().tarea,
  }),
  ...MasterAPI({
    name: "notas",
    key: "idNota",
    schema: getSchemas().notaTrato,
    action: "get_notas",
  }),
  ...DetailAPI({
    name: "contactosPorCampania",
    key: "idContacto",
    schema: getSchemas().contactosPorCampania,
  }),
  ...DetailAPI({
    name: "contactoTrato",
    key: "codContacto",
    schema: getSchemas().contacto,
  }),
  onInit: [
    {
      type: "setStateKeys",
      plug: ({ idTrato, refreshCallback, deletedCallback }) => ({
        keys: {
          idTrato,
          refreshCallback,
          deletedCallback,
        },
      }),
    },
    {
      type: "grape",
      name: "getTrato",
    },
  ],
  onGetTratoSucceded: [
    {
      type: "setStateKey",
      plug: (_, { trato }) => ({
        path: "noEncontrado",
        value: !trato?.idTrato,
      }),
    },
    {
      type: "grape",
      name: "cargaBuffer",
    },
    {
      type: "grape",
      name: "getTareas",
    },
    {
      type: "grape",
      name: "getNotas",
    },
    {
      condition: (_, { trato }) => !!trato?.cliente,
      type: "grape",
      name: "getTengoDirAuto",
    },
  ],
  cargaBuffer: [
    {
      type: "setStateKey",
      plug: (_, { trato }) => ({ path: "tratoBuffer", value: { ...trato } }),
    },
  ],
  getTengoDirAuto: [
    {
      type: "get",
      schema: getSchemas().dirAutoClientes,
      action: "data_direcciones_cliente",
      id: () => "-static-",
      params: (_, { trato }) => ({
        codcliente: trato.cliente,
      }),
      success: "onGetTengoDirAutoSucceeded",
    },
  ],
  onGetTengoDirAutoSucceeded: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({
        path: "trato.dirAuto",
        value: response?.data?.dirAuto,
      }),
    },
    {
      type: "setStateKey",
      plug: ({ response }) => ({
        path: "trato.dirAuto",
        value: response?.data?.dirAuto,
      }),
    },
  ],
  onSeccionConfirmada: [
    {
      type: "setStateKey",
      plug: ({ fields }, { trato, tratoBuffer }) => ({
        path: "trato",
        value: fields.reduce((accum, item) => ({ ...accum, [item]: tratoBuffer[item] }), trato),
      }),
    },
    {
      condition: ({ onSuccess }) => !!onSuccess,
      type: "function",
      function: ({ onSuccess }) => onSuccess && onSuccess(),
    },
    {
      // log: ({ fields }, { trato }) =>
      // ["milog", fields.reduce((accum, key) => ({ ...accum, [key]: trato[key] }), {})],
      type: "patch",
      schema: getSchemas().tratoCampania,
      id: (_, { trato }) => trato.idTrato,
      data: ({ fields }, { trato }) =>
        fields.reduce((accum, key) => ({ ...accum, [key]: trato[key] }), {}),
      success: "onTratoUpdated",
    },
    {
      type: "grape",
      name: "refreshCallback",
    },
  ],
  onTratoUpdated: [
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Trato actualizado correctamente",
        tipoMensaje: "success",
      }),
    },
    {
      type: "grape",
      name: "refreshCallback",
    },
  ],
  onSeccionCancelada: [
    {
      type: "setStateKey",
      plug: ({ fields }, { trato, tratoBuffer }) => ({
        path: "tratoBuffer",
        value: fields.reduce((accum, item) => ({ ...accum, [item]: trato[item] }), tratoBuffer),
      }),
    },
  ],
  onCabeceraSeccionConfirmada: [
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["titulo", "valor"] }),
    },
  ],
  onCabeceraSeccionCancelada: [
    {
      type: "grape",
      name: "onSeccionCancelada",
      plug: () => ({ fields: ["titulo", "valor"] }),
    },
  ],
  onContactoSeccionConfirmada: [
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["contacto"] }),
    },
  ],
  onCodagenteSeccionConfirmada: [
    {
      type: "setStateKey",
      plug: (_, { tratoBuffer }) => ({ path: "trato.codAgente", value: tratoBuffer["codAgente"] }),
    },
    {
      condition: ({ onSuccess }) => !!onSuccess,
      type: "function",
      function: ({ onSuccess }) => onSuccess && onSuccess(),
    },
    {
      type: "patch",
      action: "update_codagente_trato_campania",
      schema: getSchemas().tratoCampania,
      id: (_, { trato }) => trato.idTrato,
      data: (_, { tratoBuffer }) => ({
        codagente: tratoBuffer["codAgente"] || null,
        estadoasigagente: "Asignado",
      }),
      success: "onTratoUpdated",
    },
    {
      type: "grape",
      name: "refreshCallback",
    },
  ],
  onCodagenteSeccionCancelada: [
    {
      type: "grape",
      name: "onSeccionCancelada",
      plug: () => ({ fields: ["codAgente"] }),
    },
  ],
  onContactoSeccionCancelada: [
    {
      type: "grape",
      name: "onSeccionCancelada",
      plug: () => ({ fields: ["contacto"] }),
    },
  ],
  onTipoSeccionConfirmada: [
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["idTipotrato"] }),
    },
    {
      type: "grape",
      name: "getTrato",
    },
  ],
  onTipoSeccionCancelada: [
    {
      type: "grape",
      name: "onSeccionCancelada",
      plug: () => ({ fields: ["idTipotrato"] }),
    },
  ],
  onFechaSeccionConfirmada: [
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["fecha"] }),
    },
  ],
  onFechaSeccionCancelada: [
    {
      type: "grape",
      name: "onSeccionCancelada",
      plug: () => ({ fields: ["fecha"] }),
    },
  ],
  onNotaSeccionConfirmada: [
    {
      type: "grape",
      name: "onNuevaNotaEnter",
    },
  ],
  onNotaSeccionCancelada: [
    {
      type: "setStateKey",
      plug: () => ({ path: "nuevaNota", value: "" }),
    },
  ],
  onNuevaNotaEnter: [
    {
      type: "post",
      schema: getSchemas().notaTrato,
      action: "add_nota",
      data: (_, { idTrato, nuevaNota }) => ({
        idTrato,
        texto: nuevaNota,
        fecha: util.today(),
      }),
      success: "onNotaCreated",
    },
  ],
  onNotaCreated: [
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Nota añadida correctamente",
        tipoMensaje: "success",
      }),
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "nuevaNota", value: "" }),
    },
    {
      type: "grape",
      name: "getNotas",
    },
  ],
  refreshCallback: [
    {
      type: "function",
      function: (_, { refreshCallback }) => refreshCallback && refreshCallback(),
    },
  ],
  deletedCallback: [
    {
      type: "function",
      function: (_, { deletedCallback }) => deletedCallback && deletedCallback(),
    },
  ],
  onEditarContactoClicked: [
    // {
    //   type: "setStateKey",
    //   plug: () => ({ path: "modalEditarContactoVisible", value: true }),
    // },
    {
      log: (_, { trato }) => ["mi log", trato],
      type: "navigate",
      url: (_, { trato }) => `/ss/contacto/${trato?.contacto}`,
    },
  ],
  onCerrarEditarContacto: [
    {
      condition: ({ response }) => !!response?.pk,
      type: "grape",
      name: "onTratoBufferContactoChanged",
      plug: ({ response }) => ({ field: "tratoBuffer.contacto", value: response.pk }),
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "modalEditarContactoVisible", value: false }),
    },
    {
      type: "grape",
      name: "onContactoSectionCancelled",
      plug: () => ({ section: "contacto" }),
    },
    {
      type: "grape",
      name: "refreshCallback",
    },
  ],
  onResolverDiferenciasClicked: [
    {
      type: "setStateKeys",
      plug: (_, { trato }) => ({
        keys: {
          idContacto: trato.idContactoCampania,
          codContacto: trato.contacto,
        },
      }),
    },
    {
      type: "grape",
      name: "getContactosPorCampania",
    },
    {
      type: "grape",
      name: "getContactoTrato",
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "modalResolverDiferenciasVisible", value: true }),
    },
  ],
  onCerrarResolverDiferencias: [
    {
      type: "setStateKey",
      plug: () => ({ path: "modalResolverDiferenciasVisible", value: false }),
    },
  ],
  onContactoEditado: [
    {
      type: "setStateKey",
      plug: (payload, { refrescarContacto }) => ({
        path: "refrescarContacto",
        value: !refrescarContacto,
      }),
    },
    {
      type: "grape",
      name: "refreshCallback",
    },
  ],
  onAsignarTrato: [
    {
      type: "patch",
      action: "update_codagente_trato_campania",
      schema: getSchemas().tratoCampania,
      id: (_, { trato }) => trato.idTrato,
      data: (_, { trato }) => ({
        codagente: trato["codAgente"] || null,
        estadoasigagente: "Asignado",
      }),
      success: "onTratoUpdated",
    },
  ],
  onConfirmarDatosImportadosClicked: [
    {
      type: "patch",
      schema: getSchemas().contacto,
      id: (_, { contactoTrato }) => contactoTrato.codContacto,
      data: (_, { contactosPorCampania }) => ({
        telefono: contactosPorCampania.telefono,
        codPostal: contactosPorCampania.codPostal,
        nombre: contactosPorCampania.nombre,
        ciudad: contactosPorCampania.ciudad,
      }),
      success: "onDatosContactoUpdatedSuccess",
      error: "onDatosContactoUpdatedError",
    },
  ],
  onDatosContactoUpdatedError: [
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Error al actualizar los datos del contacto",
        tipoMensaje: "error",
      }),
    },
    {
      type: "grape",
      name: "onCerrarResolverDiferencias",
    },
  ],
  onDatosContactoUpdatedSuccess: [
    {
      type: "grape",
      name: "onConfirmarDatosBBDDClicked",
    },
  ],
  onConfirmarDatosBBDDClicked: [
    {
      type: "delete",
      schema: getSchemas().contactosPorCampania,
      id: (_, { contactosPorCampania }) => contactosPorCampania.idContacto,
      success: `contactoPorCampaniaDeleteSuccess`,
      error: "onDatosContactoUpdatedError",
    },
  ],
  contactoPorCampaniaDeleteSuccess: [
    {
      type: "grape",
      name: "onTratoUpdated",
    },
    {
      type: "grape",
      name: "onCerrarResolverDiferencias",
    },
  ],
  onBorrarTratoClicked: [
    {
      type: "userConfirm",
      question: (_, { tareas, trato }) => ({
        titulo: "¿Borrar trato?",
        cuerpo: `El trato se eliminará definitivamente${!!tareas?.idList?.length || !!trato?.idPresupuesto
            ? `, así como ${!!tareas?.idList?.length && !trato?.idPresupuesto
              ? "las tareas."
              : !tareas?.idList?.length && !!trato?.idPresupuesto
                ? "el presupuesto."
                : "las tareas y el presupuesto."
            }`
            : "."
          }`,
        textoSi: "CONFIRMAR",
        textoNo: "CANCELAR",
      }),
      onConfirm: "onBorrarTratoConfirmado",
    },
  ],
  onBorrarTratoConfirmado: [
    {
      type: "delete",
      schema: getSchemas().tratoCampania,
      id: (_, { trato }) => trato.idTrato,
      success: `tratoPorCampaniaDeleteSuccess`,
      error: "tratoPorCampaniaDeleteError",
    },
  ],
  tratoPorCampaniaDeleteSuccess: [
    {
      type: "grape",
      name: "deletedCallback",
    },
  ],
  tratoPorCampaniaDeleteError: [
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Error al borrar el trato",
        tipoMensaje: "error",
      }),
    },
  ],
  onTratoBufferCodFamiliaChanged: [
    {
      type: "setStateKey",
      plug: ({ option }, { tratoBuffer }) => {
        const auxFamilias = [];
        tratoBuffer.familias.forEach(familia => auxFamilias.push(familia));
        auxFamilias.push(option);

        return { path: "tratoBuffer.familias", value: auxFamilias };
      },
    },
  ],
  onDeleteFamiliaProductoClicked: [
    {
      type: "setStateKey",
      plug: ({ indice }, { tratoBuffer }) => {
        const auxFamilias = [];
        tratoBuffer.familias.forEach(familia => auxFamilias.push(familia));
        auxFamilias.splice(indice, 1);

        return { path: "tratoBuffer.familias", value: auxFamilias };
      },
    },
  ],
  onCodFamiliaSeccionConfirmada: [
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["familias"] }),
    },
  ],
  onCodFamiliaSeccionCancelada: [
    {
      type: "grape",
      name: "onSeccionCancelada",
      plug: () => ({ fields: ["familias"] }),
    },
  ],
  onAsociarPedidoClicked: [
    {
      type: "setStateKey",
      plug: () => ({ path: "modalAsociarPedidoVisible", value: true }),
    },
  ],
  onAsociarPedidoConfirmClicked: [
    {
      type: "setStateKey",
      plug: () => ({ path: "asociandoPedido", value: true }),
    },
    {
      type: "patch",
      schema: getSchemas().asociarPedido,
      id: (_, { tratoBuffer }) => tratoBuffer.idPedido,
      data: (payload, { trato }) => ({ idTrato: trato.idTrato }),
      success: "onAsociarPedidoSuccess",
      error: "onAsociarPedidoError",
    },
    {
      type: "grape",
      name: "refreshCallback",
    },
  ],
  onAsociarPedidoSuccess: [
    {
      condition: (_, { trato }) => !!trato.cliente,
      type: "grape",
      name: "cambiarEstadoTrato",
      plug: payload => ({ ...payload, value: "Ganado" }),
    },
    {
      condition: (_, { trato }) => !trato.cliente,
      type: "patch",
      schema: getSchemas().trato,
      id: (_, { trato }) => trato.idTrato,
      data: ({ response }) => ({
        estado: "Ganado",
        cliente: response.codcliente,
      }),
      success: "onTratoUpdated",
    },
    {
      type: "grape",
      name: "cerrarModalAsociarPedidoVisible",
    },
    {
      type: "grape",
      name: "refreshCallback",
    },
  ],
  onAsociarPedidoError: [
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Error al asociar el pedido",
        tipoMensaje: "error",
      }),
    },
    {
      type: "grape",
      name: "cerrarModalAsociarPedidoVisible",
    },
  ],
  cerrarModalAsociarPedidoVisible: [
    {
      type: "setStateKey",
      plug: () => ({ path: "modalAsociarPedidoVisible", value: false }),
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "asociandoPedido", value: false }),
    },
    {
      type: "setStateKeys",
      plug: () => ({
        keys: {
          modalAsociarPedidoVisible: false,
          asociandoPedido: false,
        },
      }),
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "tratoBuffer.idPedido", value: null }),
    },
  ],
  cambiarEstadoTrato: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "tratoBuffer.estado", value }),
    },
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["estado"] }),
    },
  ],
});
