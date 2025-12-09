import { applyBunch, getSchemas, shortcutsBunch, shortcutsState } from "quimera";

import yaml from "./NavegadorVentas.ctrl.yaml";

export const state = parent => ({
  ...parent,
  data: null,
  table: null,
  sumX: null,
  sumY: null,
  ...shortcutsState(yaml.shortcuts),
  ...yaml.state,
  filter: {},
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(yaml.shortcuts),
    getDataframe: [
      {
        type: "grape",
        name: "onClearData",
      },
      {
        // log: (a,b) => ["milog", a, b.medidas.map(value => value.key)],
        type: "post",
        action: "get_ventas_data",
        id: () => "-static-",
        data: (_, { filter, medidas, nivelesY, nivelesX }) => ({
          medidas: medidas.map(value => value.key),
          nivelesY: nivelesY.map(value => value.key),
          nivelesX: nivelesX.map(value => value.key),
          // nivelesY: ["in_dimmes_ano"],
          filter,
        }),
        schema: () => getSchemas().dataframe,
        success: "onGetDataframeSucceeded",
      },
    ],
    onClearData: [
      {
        type: "setStateKey",
        plug: ({ response }) => ({
          path: "data",
          value: null,
        }),
      },
      {
        type: "setStateKey",
        plug: ({ response }) => ({
          path: "table",
          value: null
        }),
      },
      {
        type: "setStateKey",
        plug: ({ response }) => ({
          path: "sumX",
          value: null
        }),
      },
      {
        type: "setStateKey",
        plug: ({ response }) => ({
          path: "sumY",
          value: null
        }),
      },
    ],
    onGetDataframeSucceeded: [
      {
        type: "setStateKey",
        plug: ({ response }) => ({
          path: "data",
          value: response.data,
        }),
      },
      {
        type: "setStateKey",
        plug: ({ response }) => ({
          path: "table",
          value: response.table,
        }),
      },
      {
        type: "setStateKey",
        plug: ({ response }) => ({
          path: "sumX",
          value: response.sumX,
        }),
      },
      {
        type: "setStateKey",
        plug: ({ response }) => ({
          path: "sumY",
          value: response.sumY,
        }),
      },
    ],
    onFilterChanged: [
      // {
      //   type: "setStateKey",
      //   plug: ({ value }) => ({
      //     path: "filter",
      //     value: value ?? {},
      //   }),
      // },
      {
        type: "setStateKey",
        plug: () => ({
          path: "filter.and",
          value: [["in_dimmes_ano", "in", [2023, 2024]]],
        }),
      },
      {
        type: "grape",
        name: "getDataframe",
      },
    ],
    onHandleDragEnd: [
      {
        condition: ({ result }) =>
          result.destination !== null &&
          result.destination.droppableId === "items" &&
          result.source.droppableId === "items",
        type: "grape",
        name: "moverEntreItems",
      },
      {
        condition: ({ result }) =>
          result.destination !== null &&
          result.destination.droppableId === "items" &&
          result.source.droppableId === "opciones",
        type: "grape",
        name: "añadirDesdeOpciones",
      },
    ],
    añadirDesdeOpciones: [
      {
        type: "setStateKey",
        plug: ({ result, option, fieldName }, state) => {
          if (!result.destination) {
            return;
          }
          const { destination } = result;
          const auxArray = [];
          for (const item of state[fieldName]) {
            auxArray.push(item);
          }
          auxArray.splice(destination.index, 0, option);

          return { path: fieldName, value: auxArray };
        },
      },
    ],
    moverEntreItems: [
      {
        type: "setStateKey",
        plug: ({ result, fieldName }, state) => {
          if (!result.destination) {
            return;
          }
          const { source, destination } = result;
          const auxArray = [];
          for (const item of state[fieldName]) {
            auxArray.push(item);
          }
          const [removed] = auxArray.splice(source.index, 1);
          auxArray.splice(destination.index, 0, removed);

          return { path: fieldName, value: auxArray };
        },
      },
    ],
    onBorrarItemClicked: [
      {
        type: "setStateKey",
        plug: ({ index, fieldName }, state) => {
          const auxArray = [];
          for (const item of state[fieldName]) {
            auxArray.push(item);
          }
          auxArray.splice(index, 1);

          return { path: fieldName, value: auxArray };
        },
      },
    ],
    onConfiguracionVisibleConfirmed: [
      {
        type: "setStateKey",
        plug: (_, state) => {
          const { configuracionVisible } = state;
          const auxArray = [];
          for (const item of state[`${configuracionVisible}Aux`]) {
            auxArray.push(item);
          }

          return { path: configuracionVisible, value: auxArray };
        },
      },
      {
        type: "grape",
        name: "resetconfiguracionVisible",
      },
    ],
    onConfiguracionVisibleCancelled: [
      {
        type: "setStateKey",
        plug: (_, state) => {
          const { configuracionVisible } = state;
          const auxArray = [];
          for (const item of state[configuracionVisible]) {
            auxArray.push(item);
          }

          return { path: `${configuracionVisible}Aux`, value: auxArray };
        },
      },
      {
        type: "grape",
        name: "resetconfiguracionVisible",
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(yaml.bunch, parentConShortCuts),
  };
};
