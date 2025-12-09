import { util } from "quimera";

// const baseSchema = {
//   name: 'mx_colamontadointerno',
//   key: 'idunidad',
//   page: { limit: 1000 },
//   load: (apiData) => apiData,
//   dump: (uiData) => uiData
// }

export default {
  unidades: {
    name: "mx_colamontadointerno",
    key: "idunidad",
    fields:
      "idunidad,modelo,configuracion,estado,estadoant,pausada,idtelamantas,idtelacomp,idtela,fechaprevista,estadotarea",
    page: { limit: 40 },
    load: apiData => ({
      idUnidad: apiData.idunidad.toString(),
      modelo: apiData.modelo,
      configuracion: apiData.configuracion,
      estado: apiData.estado,
      estadoant: apiData.estadoant,
      pausada: apiData.pausada,
      idtelamantas: apiData.idtelamantas,
      idtelacomp: apiData.idtelacomp,
      idtela: apiData.idtela,
      fechaprevista: apiData.fechaprevista,
      estadotarea: apiData.estadotarea,
    }),
    filter: () => ({
      and: [
        ["pr_trabajadores.idusuario", "eq", `'${util.getUser().user}'`],
        ["pr_unidadesproducto.estado", "not_in", ["'MONTADO'", "'TERMINADO'", "'CARGADO'"]],
      ],
    }),
    order: () => ({ field: "fechaprevista", direction: "ASC" }),
    dump: uiData => uiData,
  },
  // cola: {
  //   ...baseSchema
  // }
};
