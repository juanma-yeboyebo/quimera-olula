import { getSchemas } from "quimera";

export const state = parent => ({
  ...parent,
  tareas: [],
  tratos: [],
});

export const bunch = parent => ({
  ...parent,
  onInit: [
    {
      type: "get",
      schema: getSchemas().trato,
      id: () => "-static-",
      action: "get_for_agenda",
      success: "onTratosRecieved",
    },
    {
      type: "get",
      schema: getSchemas().tarea,
      id: () => "-static-",
      action: "get_for_agenda",
      success: "onTareasRecieved",
    },
  ],
  onTratosRecieved: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({
        path: "tratos",
        value: response.data,
      }),
    },
  ],
  onTareasRecieved: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({
        path: "tareas",
        value: response.data,
      }),
    },
  ],
});
