import { getSchemas } from "quimera";
import { DetailAPI, DetailCtrl, MasterAPI, MasterCtrl } from "quimera/lib";

export const state = parent => ({
  ...parent,
  evento: DetailCtrl(getSchemas().contacto),
  lineaseventos: MasterCtrl(getSchemas().lineaseventos),
  contactosevento: MasterCtrl(getSchemas().contactosCurso),
  search: "",
});

export const bunch = parent => ({
  ...parent,
  ...DetailAPI({
    name: "evento",
    key: "codEvento",
    schema: getSchemas().evento,
  }),
  ...MasterAPI({
    name: "lineaseventos",
    key: "idlineaEvento",
    schema: getSchemas().lineaseventos,
  }),
  ...MasterAPI({
    name: "contactosevento",
    key: "idInteraccion",
    schema: getSchemas().contactosCurso,
    action: "dame_contactos_evento",
  }),
  onInit: [
    {
      type: "setStateKey",
      plug: ({ codEvento }) => ({ path: "codEvento", value: codEvento }),
    },
    {
      type: "grape",
      name: "getEvento",
    },
  ],
  onGetEventoSucceded: [
    {
      type: "setStateKey",
      plug: (_, { evento }) => ({
        path: "lineaseventos.filter.and",
        value: [["codevento", "eq", `${evento.codEvento}`]],
      }),
    },
    {
      type: "setStateKey",
      plug: (_, { evento }) => ({
        path: "contactosevento.filter.and",
        value: [["codevento", "eq", `${evento.codEvento}`]],
      }),
    },
    {
      type: "grape",
      name: "getLineaseventos",
    },
    {
      type: "grape",
      name: "getContactosevento",
    },
  ],
});
