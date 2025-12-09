import { getSchemas, util } from "quimera";
import { MasterAPI, MasterCtrl, ModelAPI, ModelCtrl } from "quimera/lib";

const current_trimestre = Math.floor(new Date().getMonth() / 3) + 1;

export const state = parent => ({
  ...parent,
  modalTareasAtrasadas: false,
  search: "",
  searchRecomSubfamilia: "",
  searchRecomCliente: "",
  searchRecomDireccion: "",
  tratos: MasterCtrl(getSchemas().trato, {
    limit: 7,
    filter: { and: [["estado", "not_in", ["Ganado", "Perdido"]]] },
  }),
  tareas: ModelCtrl(getSchemas().tarea, {
    limit: 7,
    filter: { and: [["completada", "eq", "false"]] },
  }),
  totalInteraccionesCursos: 0,
  totalInteraccionesActivos: 0,
  totalTratosMkt: 0,
  totalTratosObservadorFarma: 0,
  flagCustomDate: false,
  trimestres: {
    T1: current_trimestre === 1,
    T2: current_trimestre === 2,
    T3: current_trimestre === 3,
    T4: current_trimestre === 4,
  },
  customDates: {
    from: null,
    to: null,
  },
  previsiones: {
    percent: null,
    increment: null,
    totalVentas: null,
  },
  modalCrearContactoVisible: false,
});

export const bunch = parent => ({
  ...parent,
  ...MasterAPI({
    name: "tratos",
    id: "idTrato",
    schema: getSchemas().trato,
  }),
  ...ModelAPI({
    name: "tareas",
    id: "idTarea",
    schema: getSchemas().tarea,
  }),
  onInit: [
    {
      type: "setNombrePaginaActual",
      plug: () => "",
    },
    {
      type: "grape",
      name: "getPrevisiones",
    },
    {
      type: "grape",
      name: "getTratos",
      plug: () => ({
        getTratosParams: { sinAgenteObservador: true },
      }),
    },
    {
      type: "grape",
      name: "getTareas",
      plug: () => ({
        getTareasParams: { sinAgenteObservador: true },
      }),
    },
    {
      type: "grape",
      name: "cargaInteracciones",
    },
    {
      type: "grape",
      name: "cargaContadoresTratos",
    },
    {
      type: "grape",
      name: "compruebaAvisoTareasAtrasadas",
    },
  ],
  cargaInteracciones: [
    {
      type: "get",
      id: () => "static",
      action: "get_counter_interacciones",
      schema: () => getSchemas().interaccion,
      success: "onCountInteraccionesRecibido",
    },
  ],
  cargaContadoresTratos: [
    {
      type: "get",
      id: () => "static",
      action: "get_counters_tratos",
      schema: () => getSchemas().trato,
      success: "onCounterTratosRecibido",
    },
  ],
  getPrevisiones: [
    {
      type: "get",
      schema: getSchemas().progreso,
      id: () => "-static-",
      action: "get_progreso",
      params: (_, { trimestres, flagCustomDate, customDates }) => ({
        ...trimestres,
        codAgente: util.getGlobalSetting("user_data").user.agente,
        customDates: flagCustomDate,
        dateFrom: customDates.from,
        dateTo: customDates.to,
      }),
      success: "onGetPrevisionesSucceeded",
    },
  ],
  onCountInteraccionesRecibido: [
    {
      type: "setStateKeys",
      plug: ({ response }) => ({
        keys: {
          totalInteraccionesCursos: response.totalinteraccioneseventos,
          totalInteraccionesActivos: response.totalinteraccionesactivos,
        },
      }),
    },
  ],
  onCounterTratosRecibido: [
    {
      type: "setStateKeys",
      plug: ({ response }) => ({
        keys: {
          totalTratosMkt: response.totaltratosmkt,
          totalTratosObservadorFarma: response.totaltratosobservadorfarma,
        },
      }),
    },
  ],
  onGetPrevisionesSucceeded: [
    {
      log: ({ response }) => ["mylog", response],
      type: "setStateKey",
      plug: ({ response }) => ({
        path: "previsiones",
        value: {
          percent: (response?.percent ?? 0).toFixed(0),
          increment: util.formatter(response?.increment, 2),
          totalVentas: util.euros(response?.total ?? 0),
          totalVentasResumido:
            response?.total < 1000
              ? `${util.formatter(response?.total ?? 0, 2)}€`
              : `${util.formatter(response?.total / 1000, 2)}K €`,
        },
      }),
    },
  ],
  onTratoEstadoChanged: [
    {
      type: "patch",
      schema: getSchemas().trato,
      id: ({ id }) => id,
      data: ({ estado }) => ({ estado }),
      success: "onEstadoUpdated",
    },
  ],
  onEstadoUpdated: [
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Trato actualizado correctamente",
        tipoMensaje: "success",
      }),
    },
    {
      type: "grape",
      name: "getTratos",
    },
  ],
  onTrimestreClicked: [
    {
      type: "setStateKey",
      plug: ({ trimestre }, { trimestres }) => ({
        path: `trimestres.${trimestre}`,
        value: !trimestres[trimestre],
      }),
    },
    {
      type: "grape",
      name: "getPrevisiones",
    },
  ],
  onCustomDateChanged: [
    {
      type: "setStateKey",
      plug: ({ field, value }) => ({
        path: `customDates.${field}`,
        value,
      }),
    },
    {
      type: "grape",
      name: "getPrevisiones",
    },
  ],
  onFlagCustomDateChanged: [
    {
      type: "setStateKey",
      plug: (_, { flagCustomDate }) => ({
        path: "flagCustomDate",
        value: !flagCustomDate,
      }),
    },
    {
      type: "grape",
      name: "getPrevisiones",
    },
  ],
  onGoRecomClienteClicked: [
    {
      type: "navigate",
      url: (_, { searchRecomCliente, searchRecomDireccion }) =>
        `/ss/recom-cliente/${searchRecomCliente}/${searchRecomDireccion}`,
    },
  ],
  onGoRecomSubfamiliaClicked: [
    {
      type: "navigate",
      url: (_, { searchRecomSubfamilia }) => `/ss/recom-subfamilia/${searchRecomSubfamilia}`,
    },
  ],
  compruebaAvisoTareasAtrasadas: [
    {
      type: "function",
      function: () => {
        const codAgente = util.getGlobalSetting("user_data").user.agente;
        const fechaHoy = util.formatDate(new Date());
        const datosAvisoTareasAtrasadas = util.getGlobalSetting("aviso_tareas_atrasadas");
        const contarTareasAtrasadas =
          !datosAvisoTareasAtrasadas ||
          datosAvisoTareasAtrasadas.codAgente !== codAgente ||
          datosAvisoTareasAtrasadas.fecha !== fechaHoy ||
          !datosAvisoTareasAtrasadas.value;

        return { contarTareasAtrasadas };
      },
      success: [
        {
          condition: ({ response }) => response.contarTareasAtrasadas,
          type: "grape",
          name: "countTareasAtrasadas",
        },
      ],
    },
  ],
  countTareasAtrasadas: [
    {
      type: "get",
      schema: getSchemas().totalesTratos,
      id: () => "-static-",
      action: "get_totales",
      params: () => ({ conTareasAtrasadas: true }),
      success: "onCountTareasAtrasadasRecibido",
    },
  ],
  onCountTareasAtrasadasRecibido: [
    {
      condition: ({ response }) => response?.data?.total > 0,
      type: "setStateKey",
      plug: () => ({ path: "modalTareasAtrasadas", value: true }),
    },
    {
      type: "function",
      function: () => {
        util.setGlobalSetting("aviso_tareas_atrasadas", {
          codAgente: util.getGlobalSetting("user_data").user.agente,
          fecha: util.formatDate(new Date()),
          value: true,
        });
      },
    },
  ],
  verTratosTareasAtrasadasClicked: [
    {
      type: "navigate",
      url: () => `/ss/tratos/modo/tareasAtrasadas`,
    },
  ],
  cerrarModalTareasAtrasadas: [
    {
      type: "setStateKey",
      plug: () => ({ path: "modalTareasAtrasadas", value: false }),
    },
  ],
  onCrearNuevoContactoClicked: [
    {
      type: "setStateKey",
      plug: () => ({ path: "modalCrearContactoVisible", value: true }),
    },
  ],
  onCerrarCrearContacto: [
    // {
    //   condition: ({ response }) => !!response?.pk,
    //   type: "grape",
    //   name: "onTratoContactoChanged",
    //   plug: ({ response }) => ({ field: "trato.contacto", value: response.pk }),
    // },
    {
      type: "setStateKey",
      plug: () => ({ path: "modalCrearContactoVisible", value: false }),
    },
  ],
});
