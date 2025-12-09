import { getSchemas } from "quimera";
import { MasterAPI, MasterCtrl, ModelAPI, ModelCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  enInteracciones: false,
  // contactos: MasterCtrl(getSchemas().contactoSummary),
  contactos: ModelCtrl(getSchemas().contactoSummary),
  interaccionesCursosData: MasterCtrl(getSchemas().contactoInteraccionCursos),
  interaccionesActivosData: MasterCtrl(getSchemas().contactoInteraccionActivo),
  totalpedidos: 0,
  search: "",
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "contactos",
    id: "codContacto",
    schema: getSchemas().contactoSummary,
    action: "get_contactos_with_summary",
  }),
  ...MasterAPI({
    name: "interaccionesCursosData",
    id: "codcontacto",
    schema: getSchemas().contactoInteraccionCursos,
    action: "get_contactos_ultimo_evento",
  }),
  ...MasterAPI({
    name: "interaccionesActivosData",
    id: "codcontacto",
    schema: getSchemas().contactoInteraccionActivo,
    action: "get_contactos_activos",
  }),
  onInit: [
    {
      type: "grape",
      name: "setSearch",
      plug: ({ search }) => ({ search }),
    },
    {
      condition: ({ tipo }) => !tipo,
      type: "grape",
      name: "getContactos",
    },
    {
      type: "setStateKey",
      plug: ({ tipo }) => ({ path: "enInteracciones", value: !!tipo }),
    },
    {
      condition: ({ tipo }) => !!tipo && tipo === "activos",
      type: "grape",
      name: "getInteraccionesActivosData",
    },
    {
      condition: ({ tipo }) => !!tipo && tipo === "cursos",
      type: "grape",
      name: "getInteraccionesCursosData",
    },
    {
      condition: ({ tipo }) => !!tipo && tipo === "cursos",
      type: "grape",
      name: "cargaPedidosOtroAgente",
    },
  ],
  cargaPedidosOtroAgente: [
    {
      type: "get",
      id: () => "static",
      action: "get_count_pedidos_otro_agente",
      schema: () => getSchemas().interaccion,
      success: "onCountPedidosOtroAgenteRecibido",
    },
  ],
  onCountPedidosOtroAgenteRecibido: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({ path: "totalpedidos", value: response.totalpedidos }),
    },
  ],
  onSearchChanged: [
    {
      condition: (_, { enInteracciones }) => enInteracciones,
      type: "navigate",
      url: ({ value }) => `/ss/contactos/${value}`,
    },
    {
      condition: (_, { enInteracciones }) => !enInteracciones,
      type: "grape",
      name: "setSearch",
      plug: ({ value }) => ({ search: value }),
    },
    {
      condition: (_, { enInteracciones }) => !enInteracciones,
      type: "grape",
      name: "getContactos",
    },
  ],
  setSearch: [
    {
      type: "setStateKey",
      plug: ({ search }) => ({ path: "search", value: search }),
    },
    {
      type: "setStateKey",
      plug: ({ search }) => ({
        path: "contactos.filter.and",
        value: {
          or: [
            ["nombre", "like_ua", search ?? ""],
            // ["nombre", "like", search ?? ""],
            ["UPPER(crm_contactos.email)", "like", search.toUpperCase() ?? ""],
            ["telefono1", "like", search ?? ""],
          ],
        },
      }),
    },
  ],
});
