import { getSchemas } from "../";
import util from "../util";

const getSchema = (schema, payload, state) =>
  schema && {}.toString.call(schema) === "[object Function]"
    ? { schema: schema(payload, state) }
    : { schema };

const masterCtrl = (schema, { limit = 50, filter = {} } = {}) => ({
  list: [],
  page: {
    limit: schema?.limit ?? limit,
    next: null,
    previous: null,
  },
  loading: true,
  filter,
  order: schema?.order?.() || null,
});

const detailCtrl = schema => schema.load({});

const masterApi = ({ name, table, schema, action }) => ({
  [`get${util.camelId(name)}`]: [
    {
      type: "setStateKey",
      plug: () => ({ path: `${name}.loading`, value: true }),
    },
    {
      type: "function",
      function: (payload, state) => getSchema(schema, payload, state),
      success: [
        {
          type: "get",
          id: () => (action ? "-static-" : null),
          schema: ({ response }) => response.schema,
          filter: ({ response }, state) => {
            const schemaFilter = response.schema.filter ? response.schema.filter(state) : null;
            const stateFilter = state[name].filter?.and;
            const isArray = Array.isArray(stateFilter);

            if (schemaFilter || stateFilter) {
              return {
                and: [schemaFilter, ...((isArray ? stateFilter : [stateFilter]) || [])].filter(
                  Boolean,
                ),
              };
            }
          },
          params: payload => {
            return payload[`get${util.camelId(name)}Params`] || null;
          },
          page: ({ page }, state) =>
            page === "next"
              ? { limit: state[name].page.limit, next: state[name].page.next }
              : { limit: state[name].page.limit },
          order: ({ response }, state) =>
            state[name].order
              ? state[name].order
              : response.schema.order
                ? response.schema.order(state)
                : null,
          action,
          success: `on${util.camelId(name)}Received`,
        },
      ],
    },
  ],
  [`on${util.camelId(name)}Received`]: [
    {
      type: "setStateKey",
      plug: ({ response, page }, state) => ({
        path: name,
        value: {
          ...state[name],
          list: page === "next" ? [...state[name].list, ...response.data] : response.data,
          page: response.page,
          loading: false,
        },
      }),
    },
    {
      type: "grape",
      name: `onGet${util.camelId(name)}Succeded`,
    },
  ],
  [`onNext${util.camelId(name)}`]: [
    {
      type: "grape",
      name: `get${util.camelId(name)}`,
      plug: () => ({ page: "next" }),
    },
  ],
  [`on${util.camelId(name)}FilterChanged`]: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: `${name}.filter`, value }),
    },
    {
      type: "grape",
      name: `get${util.camelId(name)}`,
    },
  ],
  [`on${util.camelId(table)}ColumnClicked`]: [
    {
      type: "setStateKey",
      plug: ({ data }, state) => ({
        path: `${name}.order`,
        value: {
          field: data.order ?? data.id,
          direction:
            state[name].order &&
            state[name].order.field === (data.order ?? data.id) &&
            state[name].order.direction === "ASC"
              ? "DESC"
              : "ASC",
        },
      }),
    },
    {
      type: "grape",
      name: `get${util.camelId(name)}`,
    },
  ],
});

const detailApi = ({ key, name, schema, validation, action, forcePk }) => ({
  [`get${util.camelId(name)}`]: [
    {
      type: "function",
      function: (payload, state) => getSchema(schema, payload, state),
      success: [
        {
          condition: (...[, state]) => !!state[key],
          type: "get",
          schema: ({ response }) => response.schema,
          id: (...[, state]) => (action && !forcePk ? "-static-" : state[key]),
          action,
          success: `on${util.camelId(name)}Received`,
        },
        {
          condition: (...[, state]) => !state[key],
          type: "grape",
          name: `cleanUp${util.camelId(name)}`,
        },
      ],
    },
  ],
  [`on${util.camelId(name)}Received`]: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({ path: name, value: response.data[0] }),
    },
    {
      type: "grape",
      name: `onGet${util.camelId(name)}Succeded`,
    },
  ],
  // Para probar con Xavi
  // ...saveApi({ name: `${name}Interno`, idPath: key, dataPath: name, schema }),
  // [`onSave${util.camelId(name)}Clicked`]: [
  //   {
  //     type: 'grape',
  //     name: `onSave${util.camelId(name)}InternoClicked`
  //   }
  // ],
  // [`on${util.camelId(name)}InternoSaved`]: [
  //   {
  //     type: 'grape',
  //     name: `on${util.camelId(name)}Saved`
  //   },
  // ],
  // [`onSave${util.camelId(name)}InternoFailed`]: [
  //   {
  //     type: 'setStateKey',
  //     plug: ({ response }) => ({
  //       path: `${name}Validation`,
  //       value: response.validation,
  //     }),
  //   },
  //   {
  //     type: 'grape',
  //     name: `onSave${util.camelId(name)}Failed`
  //   }
  // ],
  [`onSave${util.camelId(name)}Clicked`]: [
    {
      type: "function",
      function: (payload, state) => ({
        val: schema?.validation?.(state[name]) ?? { errors: false },
        ...getSchema(schema, payload, state),
      }),
      success: [
        {
          condition: ({ response }, state) =>
            Object.values(response.val).every(v => !v) && !!state[key],
          type: "patch",
          schema: ({ response }) => response.schema,
          id: (...[, state]) => state[key],
          data: (...[, state]) => state[name],
          success: `on${util.camelId(name)}Saved`,
        },
        {
          condition: ({ response }, state) =>
            Object.values(response.val).every(v => !v) && !state[key],
          type: "post",
          schema: ({ response }) => response.schema,
          data: (...[, state]) => state[name],
          success: `on${util.camelId(name)}Saved`,
        },
        {
          condition: ({ response }) => Object.values(response.val).some(v => !!v),
          type: "grape",
          name: `onSave${util.camelId(name)}Failed`,
        },
        {
          condition: ({ response }) => Object.values(response.val).some(v => !!v),
          type: "setStateKey",
          plug: ({ response }) => ({
            path: `${name}Validation`,
            value: response.val,
          }),
        },
      ],
    },
  ],
  [`on${util.camelId(name)}Saved`]: [
    {
      type: "grape",
      name: `cleanUp${util.camelId(name)}`,
    },
    {
      type: "grape",
      name: `onSave${util.camelId(name)}Succeded`,
    },
  ],
  [`on${util.camelId(name)}Changed`]: [
    {
      type: "setStateKey",
      plug: ({ field, value }, state) => ({
        path: name,
        value: { ...state[name], [field]: value },
      }),
    },
    {
      condition: () => !!validation,
      type: "function",
      function: (payload, state) => ({
        ...payload,
        ...getSchema(schema, payload, state),
      }),
      success: [
        {
          type: "setStateKey",
          plug: ({ response }, state) => ({
            path: `${name}Validation`,
            value: {
              ...state[`${name}Validation`],
              [response.field]: response.schema?.validation?.(state[name], response.field),
            },
          }),
        },
      ],
    },
  ],
  [`onCancel${util.camelId(name)}Clicked`]: [
    {
      type: "grape",
      name: `cleanUp${util.camelId(name)}`,
    },
  ],
  [`cleanUp${util.camelId(name)}`]: [
    {
      type: "function",
      function: (payload, state) => getSchema(schema, payload, state),
      success: [
        {
          condition: (...[, state]) => !state[key],
          type: "setStateKey",
          plug: ({ response }) => ({
            path: name,
            value: response.schema.load({}),
          }),
        },
        {
          condition: (...[, state]) => !!state[key],
          type: "grape",
          name: `get${util.camelId(name)}`,
        },
        {
          condition: () => !!validation,
          type: "setStateKey",
          plug: () => ({ path: `${name}Validation`, value: {} }),
        },
      ],
    },
  ],
  [`onDelete${util.camelId(name)}Clicked`]: [
    {
      type: "function",
      function: (payload, state) => getSchema(schema, payload, state),
      success: [
        {
          type: "delete",
          schema: ({ response }) => response.schema,
          id: (...[, state]) => state[key],
          success: `on${util.camelId(name)}Deleted`,
        },
      ],
    },
  ],
  [`on${util.camelId(name)}Deleted`]: [
    {
      type: "grape",
      name: `onDelete${util.camelId(name)}Succeded`,
    },
  ],
});

const modelCtrl = ({ schema }) => {
  const mySchema = typeof schema === "string" ? getSchemas()[schema] : schema;

  return {
    // list: [],
    dict: {},
    idList: [],
    page: {
      limit: mySchema?.limit ?? 50,
      next: null,
      previous: null,
    },
    loading: true,
    filter: {},
    order: mySchema?.order?.() || null,
    current: null,
    // new: schema.load({})
  };
};

// -> get{Modelo}: Lanza la búsqueda de la primera página, si va bien carga la estructura de datos y llama a onGet{Modelo}Succeded
// -> onNext{Modelo}: Lanza la búsqueda de la siguiente página, si va bien agrega la estructura de datos y llama a onGet{Modelo}Succeded
// -> on{Modelo}FilterChanged: Modifica el filtro y llama a get{Modelo}
// -> on{Modelo}ColumnClicked: Modifica la columna de ordenación y llama a get{Modelo}
// -> onId{Modelo}Prop: Cambia el valor de current y llama a onId{Modelo}Changed
// -> on{Modelo}Clicked: Navega a la instancia seleccionada con click si hay URL o llama a onId{Modelo}Prop
// -> reloadOne{Modelo}: Recarga un registro y lo modifica o incorpora en la estructura de datos. Llama a onReloadOne{Modelo}Succeded
// -> deleteKey{Modelo}: Elimina un elemento de la lista y el diccionario, y pone el current a nulo si coincide con el elemento eliminado
// <- onGet{Modelo}Succeded
// <- onId{Modelo}Changed
// <- onReloadOne{Modelo}Succeded

const modelApi = ({ name, id, table, schema, url, action, logicDelete }) => {
  const model = util.camelId(name);
  schema = typeof schema === "string" ? getSchemas()[schema] : schema;

  return {
    [`get${model}`]: [
      {
        type: "setStateKey",
        plug: () => ({ path: `${name}.loading`, value: true }),
      },
      {
        log: ({ page }, state) => [
          "getModel_",
          `get${model}`,
          page,
          { limit: state[name].page.limit },
        ],
        type: "get",
        id: () => (action ? "-static-" : null),
        schema: () => schema,
        filter: (payload, state) => {
          const schemaFilter = schema.filter ? schema.filter(state) : null;
          const stateFilter = state[name].filter?.and;
          const isArray = Array.isArray(stateFilter);

          if (schemaFilter || stateFilter) {
            return {
              and: [schemaFilter, ...((isArray ? stateFilter : [stateFilter]) || [])].filter(
                Boolean,
              ),
            };
          }
        },
        params: payload => {
          // const params = payload[`get${model}Params`];
          return payload[`get${model}Params`] || null;
        },
        page: ({ page }, state) =>
          page === "next"
            ? { limit: state[name].page.limit, next: state[name].page.next }
            : { limit: state[name].page.limit },
        order: (_, state) =>
          state[name].order ? state[name].order : schema.order ? schema.order(state) : null,
        action,
        success: `on${model}Received`,
      },
    ],
    [`on${model}Received`]: [
      {
        type: "setStateKey",
        plug: ({ response, page }, state) => ({
          path: name,
          value: {
            ...state[name],
            dict: response.data.reduce(
              (dict, item) => ({ ...dict, [item[id]]: item }),
              page === "next" ? state[name].dict : {},
            ),
            idList: [
              ...(page === "next" ? state[name].idList : []),
              ...response.data.map(d => d[id]),
            ],
            page: response.page,
            loading: false,
          },
        }),
      },
      // {
      //   condition: (...[, state]) => !state[name].idList.includes(state[name].current) && !!url,
      //   type: "navigate",
      //   url: () => `${url}`,
      // },
      {
        type: "grape",
        name: `onGet${model}Succeded`,
      },
    ],
    [`onNext${model}`]: [
      {
        type: "grape",
        name: `get${model}`,
        plug: payload => ({ page: "next", ...payload }),
      },
    ],
    [`on${model}FilterChanged`]: [
      {
        type: "setStateKey",
        plug: ({ value }) => ({ path: `${name}.filter`, value }),
      },
      {
        type: "grape",
        name: `get${model}`,
      },
    ],
    [`on${util.camelId(table)}ColumnClicked`]: [
      {
        type: "setStateKey",
        plug: ({ data }, state) => ({
          path: `${name}.order`,
          value: {
            field: data.order ?? data.id,
            direction:
              state[name].order &&
              state[name].order.field === (data.order ?? data.id) &&
              state[name].order.direction === "ASC"
                ? "DESC"
                : "ASC",
          },
        }),
      },
      {
        type: "grape",
        name: `get${model}`,
      },
    ],
    [`onId${model}Prop`]: [
      // Deprecated. Usa setCurrent${model}Item en su lugar
      `setCurrent${model}Item`,
    ],
    [`setCurrent${model}Item`]: [
      {
        type: "setStateKey",
        plug: ({ id }) => ({ path: `${name}.current`, value: id }),
      },
      {
        // Deprecated. Usa onCurrent${model}ItemChanged en su lugar
        type: "grape",
        name: `onId${model}Changed`,
      },
      {
        type: "grape",
        name: `onCurrent${model}ItemChanged`,
      },
    ],
    [`on${model}Clicked`]: [
      // Deprecated. Usa on${model}ItemSelected en su lugar
      `on${model}ItemSelected`,
    ],
    [`on${model}ItemSelected`]: [
      {
        condition: ({ item }, state) => item[id] !== state[name].current && !!url,
        type: "navigate",
        url: ({ item }) => `${url}/${item[id]}`,
      },
      {
        condition: ({ item }, state) => item[id] !== state[name].current,
        type: "grape",
        name: `onId${model}Prop`,
        plug: ({ item }) => ({ id: item[id] }),
      },
    ],
    [`reloadCurrent${model}Item`]: [
      {
        // log: (payload) => ['reloading...', `reloadCurrent${model}Item`],
        type: "grape",
        name: `reload${model}Item`,
        plug: (_, state) => ({ id: state[name].current }),
      },
    ],
    [`reload${model}Item`]: [
      {
        // log: (payload) => ['reloading...', `reload${model}Item`],
        type: "get",
        id: payload => payload.id,
        schema: () => schema,
        action,
        success: `on${model}ItemReceived`,
      },
    ],
    [`on${model}ItemReceived`]: [
      {
        condition: ({ response }) => response.data.length > 0,
        type: "setStateKey",
        plug: ({ response }, state) => {
          const idValue = response.data[0][id];
          const nuevo = !state[name].idList.includes(idValue);
          response.data[0]._status = "new";

          return {
            path: name,
            value: {
              ...state[name],
              dict: {
                ...state[name].dict,
                [response.data[0][id]]: response.data[0],
              },
              idList: nuevo ? [idValue, ...state[name].idList] : [...state[name].idList],
            },
          };
        },
      },
      {
        condition: ({ response }, state) =>
          response.data.length > 0 && response.data[0][id] !== state[name].current && !!url,
        type: "navigate",
        url: ({ response }) => `${url}/${response.data[0][id]}`,
      },
      {
        condition: ({ response }, { pedidos }) => !response.data.length,
        type: "grape",
        name: `deleteKey${model}`,
        plug: (_, state) => ({ id }),
      },
      {
        type: "grape",
        name: `onReload${model}ItemSucceded`,
      },
    ],
    [`on${model}ItemDeleted`]: [`reloadCurrent${model}`],
    [`deleteKey${model}`]: [
      {
        type: "deleteFromDict",
        dictPath: `${name}.dict`,
        keyPath: id,
      },
      {
        type: "deleteFromList",
        listPath: `${name}.idList`,
        keyPath: id,
      },
      {
        condition: (payload, state) =>
          util.getStateValue(`${id}`, payload) === util.getStateValue(`${name}.current`, state),
        type: "cleanKey",
        keyPath: `${name}.current`,
      },
    ],
    [`on${model}ItemChanged`]: [
      {
        condition: ({ event, item }, state) => event === "deleted" && !!state[name].dict[item[id]],
        type: "grape",
        name: `delete${model}Item`,
      },
      {
        condition: ({ event, item }, state) =>
          event === "deleted" && !state[name].dict[item[id]] && !!url,
        type: "navigate",
        url: () => `${url}`,
      },
      {
        condition: ({ event }) => event === "deleted" && !!url,
        type: "navigate",
        url: () => `${url}`,
      },
      {
        condition: ({ event }) => event === "edited",
        type: "grape",
        name: `change${model}Item`,
      },
      {
        condition: ({ event }) => event === "cancelled",
        type: "setStateKey",
        plug: () => ({ path: `${name}.current`, value: null }),
      },
      {
        condition: ({ event }) => event === "cancelled" && !!url,
        type: "navigate",
        url: () => `${url}`,
      },
    ],
    [`change${model}Item`]: [
      {
        type: "setStateKey",
        plug: ({ item }) => ({
          path: `${name}.dict.${item[id]}`,
          value: { ...item },
        }),
      },
      {
        // log: (_, state) => ['reloading ', `change${model}Item`],
        condition: ({ onSuccess }) => !!onSuccess,
        type: "function",
        function: ({ onSuccess }) => onSuccess(),
      },
    ],
    [`delete${model}Item`]: [
      {
        condition: () => !!logicDelete,
        type: "setStateKey",
        plug: ({ item }) => ({
          path: `${name}.dict.${item[id]}._status`,
          value: "deleted",
        }),
      },
      {
        condition: () => !logicDelete,
        type: "grape",
        name: `deleteKey${model}`,
        plug: ({ item }, state) => ({ [id]: item[id] }),
      },
      {
        condition: ({ onSuccess }) => !!onSuccess,
        type: "function",
        function: ({ onSuccess }) => onSuccess(),
      },
      {
        condition: () => !!url,
        type: "navigate",
        url: () => `${url}`,
      },
      {
        type: "cleanKey",
        keyPath: `${name}.current`,
      },
    ],
    [`add${model}Item`]: [
      {
        condition: ({ event }) => event === "created",
        type: "grape",
        name: `reload${model}Item`,
        // plug: ({ key },) => ({ id: key })
      },
      {
        condition: ({ event }) => event === "cancelled" && !!url,
        type: "navigate",
        url: () => `${url}`,
      },
    ],
    [`delete${model}Item`]: [
      {
        condition: () => !!logicDelete,
        type: "setStateKey",
        plug: ({ item }) => ({
          path: `${name}.dict.${item[id]}._status`,
          value: "deleted",
        }),
      },
      {
        condition: () => !logicDelete,
        type: "grape",
        name: `deleteKey${model}`,
        plug: ({ item }, state) => ({ [id]: item[id] }),
      },
      {
        condition: ({ onSuccess }) => !!onSuccess,
        type: "function",
        function: ({ onSuccess }) => onSuccess(),
      },
      {
        condition: () => !!url,
        type: "navigate",
        url: () => `${url}`,
      },
      {
        type: "cleanKey",
        keyPath: `${name}.current`,
      },
    ],
    [`check${model}FilterSaved`]: [
      {
        type: "function",
        function: () => {
          const filterSaved = util.getLastFilter(util.camelId(`${model}Filter`));
          if (!!filterSaved && Object.keys(filterSaved).length > 0) {
            return { noFilterSaved: false };
          } else {
            return { noFilterSaved: true };
          }
        },
        success: `check${model}FilterSavedProcessed`,
      },
    ],
    [`check${model}FilterSavedProcessed`]: [
      {
        condition: ({ response }) => !!response.noFilterSaved,
        type: "grape",
        name: `get${model}`,
      },
    ],
  };
};
/*
const modelApi = ({ name, id, table, schema, url, action }) => ({
  [`get${util.camelId(name)}`]: [
    {
      type: 'setStateKey',
      plug: () => ({ path: `${name}.loading`, value: true }),
    },
    {
      type: 'function',
      function: (payload, state) => getSchema(schema, payload, state),
      success: [
        {
          type: 'get',
          id: () => (action ? '-static-' : null),
          schema: ({ response }) => response.schema,
          filter: ({ response }, state) => {
            const schemaFilter = response.schema?.filter
              ? response.schema.filter(state)
              : null
            const stateFilter = state[name].filter?.and
            const isArray = Array.isArray(stateFilter)

            if (schemaFilter || stateFilter)
              return {
                and: [
                  schemaFilter,
                  ...((isArray ? stateFilter : [stateFilter]) || []),
                ].filter(Boolean),
              }
          },
          page: ({ page }, state) =>
            page === 'next'
              ? { limit: state[name].page.limit, next: state[name].page.next }
              : { limit: state[name].page.limit },
          order: ({ response }, state) =>
            state[name].order
              ? state[name].order
              : response.schema?.order
              ? response.schema?.order(state)
              : null,
          action: action,
          success: `on${util.camelId(name)}Received`,
        },
      ],
    },
  ],
  [`on${util.camelId(name)}Received`]: [
    {
      type: 'setStateKey',
      plug: ({ response, page }, state) => ({
        path: name,
        value: {
          ...state[name],
          dict: response.data.reduce(
            (dict, item) => ({ ...dict, [item[id]]: item }),
            page === 'next' ? state[name].dict : {}
          ),
          idList: [
            ...(page === 'next' ? state[name].idList : []),
            ...response.data.map((d) => d[id]),
          ],
          page: response.page,
          loading: false,
        },
      }),
    },
    {
      condition: (...[, state]) =>
        !state[name].idList.includes(state[name].current) && !!url,
      type: 'navigate',
      url: () => `${url}`,
    },
    {
      type: 'grape',
      name: `onGet${util.camelId(name)}Succeded`,
    },
  ],
  [`onNext${util.camelId(name)}`]: [
    {
      type: 'grape',
      name: `get${util.camelId(name)}`,
      plug: () => ({ page: 'next' }),
    },
  ],
  [`on${util.camelId(name)}FilterChanged`]: [
    {
      type: 'setStateKey',
      plug: ({ value }) => ({ path: `${name}.filter`, value: value }),
    },
    {
      type: 'grape',
      name: `get${util.camelId(name)}`,
    },
  ],
  [`on${util.camelId(table)}ColumnClicked`]: [
    {
      type: 'setStateKey',
      plug: ({ data }, state) => ({
        path: `${name}.order`,
        value: {
          field: data.order ?? data.id,
          direction:
            state[name].order &&
            state[name].order.field === (data.order ?? data.id) &&
            state[name].order.direction === 'ASC'
              ? 'DESC'
              : 'ASC',
        },
      }),
    },
    {
      type: 'grape',
      name: `get${util.camelId(name)}`,
    },
  ],
  [`onId${util.camelId(name)}Prop`]: [
    {
      type: 'setStateKey',
      plug: ({ id }) => ({ path: `${name}.current`, value: id }),
    },
    {
      type: 'grape',
      name: `onId${util.camelId(name)}Changed`,
    },
  ],
  [`on${util.camelId(name)}Clicked`]: [
    {
      condition: ({ item }, state) => item[id] !== state[name].current && !!url,
      type: 'navigate',
      url: ({ item }) => `${url}/${item[id]}`,
    },
    {
      condition: ({ item }, state) => item[id] !== state[name].current,
      type: 'grape',
      name: `onId${util.camelId(name)}Prop`,
      plug: ({ item }) => ({ id: item[id] }),
    },
  ],
})
*/

// detailBuffer
// -----------------
// Conecta los cambios en {Modelo}.buffer para llamar a la API y actualizarlo
//
// State:
// {Modelo}: {
//   data: {} <- Datos del modelo en BD del servidor (vacío en modo inserción)
//   buffer: {}, <- Datos del modelo a usar en los forms, son los que se modifican
//   bufferValidation: {} <- Estado de validación de cada campo
// }
//
// -> initBuffer{Modelo}: Obtiene un modelo inicializado y lo informa en el buffer
// -> loadBuffer{Modelo}: Pasa los datos del data al buffer
// -> dumpBuffer{Modelo}: Pasa los datos del buffer al data
// -> setChangesForBuffer{Modelo}: Permite lanzar una actualización de uno o más campos diréctamente por código. Payload { changes: { paramValues: [{ key: campo1, valor valor1, { key: campo2, valor: valor2 }] }}
// -> onSave{Modelo}Clicked: Guarda los datos del buffer modelo, lo pasa al data y llama a on{Modelo}Saved
//
// <- on{Modelo}Saved: El modelo ha sido guardado correctamente
// <- onSave{Modelo}Failed: Ha habido un error al guardar el modelo

const detailBufferCtrl = ({ schemaName }) => ({
  data: getSchemas()[schemaName].load({}),
  buffer: getSchemas()[schemaName].load({}),
  bufferValidation: {},
  callbackChanged: null,
  event: {
    serial: 0,
    type: null,
    onSuccess: null,
  },
});

const detailBufferApi = ({
  id,
  name,
  schemaName,
  parentId,
  mode,
  validation,
  action,
  deleteConfirmQuestion = {},
  remoteBufferChanged = true,
}) => {
  const schema = getSchemas()[schemaName];
  const model = util.camelId(name);

  return {
    [`onInit`]: [
      {
        condition: payload => !!payload[`idParent${model}`],
        type: "setStateKey",
        plug: payload => ({
          path: `${name}.buffer.${parentId}`,
          value: payload[`idParent${model}`],
        }),
      },
      {
        condition: payload => !payload[`init${model}`] && mode === "insert",
        type: "grape",
        name: `initBuffer${model}`,
      },
    ],
    [`onInit${model}`]: [
      {
        condition: (payload, state) =>
          !!payload[`init${model}`] && payload[`init${model}`][id] !== state[name].data[id],
        type: "grape",
        name: `onInit${model}Changed`,
      },
    ],
    [`onInit${model}ById`]: [
      {
        condition: payload => !!payload[`id${model}`],
        type: "grape",
        name: `get${model}ById`,
      },
      {
        condition: payload => !payload[`id${model}`] && !!payload[`filter${model}`],
        type: "grape",
        name: `get${model}ByFilter`,
      },
    ],
    [`get${model}ById`]: [
      {
        type: "setStateKey",
        plug: () => ({ path: `${name}.loading`, value: true }),
      },
      {
        type: "get",
        id: payload => payload[`id${model}`],
        schema: () => schema,
        params: payload => {
          return payload[`get${model}Params`] || null;
        },
        action,
        success: `on${model}ByIdReceived`,
      },
    ],
    [`get${model}ByFilter`]: [
      {
        type: "setStateKey",
        plug: () => ({ path: `${name}.loading`, value: true }),
      },
      {
        type: "get",
        id: ({ action }) => (action ? "-static-" : null),
        schema: () => schema,
        params: payload => {
          return payload[`get${model}Params`] || null;
        },
        filter: payload => payload[`filter${model}`],
        action,
        success: `on${model}ByIdReceived`,
      },
    ],
    [`on${model}ByIdReceived`]: [
      {
        condition: payload => !!payload.response.data[0],
        type: "grape",
        name: `on${model}ByIdReceivedWithData`,
      },
    ],
    [`on${model}ByIdReceivedWithData`]: [
      {
        type: "setStateKey",
        plug: payload => ({
          path: `${name}.data`,
          value: payload.response.data[0],
        }),
      },
      {
        type: "grape",
        name: `loadBuffer${model}`,
      },
      {
        type: "grape",
        name: `onInit`,
      },
    ],
    [`onInit${model}Changed`]: [
      {
        type: "grape",
        name: `loadInit${model}`,
      },
      {
        type: "grape",
        name: `onInit`,
      },
    ],
    [`loadInit${model}`]: [
      {
        type: "setStateKey",
        plug: payload => ({
          path: `${name}.data`,
          value: payload[`init${model}`],
        }),
      },
      {
        type: "grape",
        name: `loadBuffer${model}`,
      },
    ],
    [`loadBuffer${model}`]: [
      {
        type: "setStateKey",
        plug: (_, state) => ({
          path: `${name}.buffer`,
          value: { ...state[name].data },
        }),
      },
    ],
    [`dumpBuffer${model}`]: [
      {
        type: "setStateKey",
        plug: (_, state) => ({
          path: `${name}.data`,
          value: { ...state[name].buffer },
        }),
      },
    ],
    [`initBuffer${model}`]: [
      {
        type: "get",
        schema,
        id: () => "-static-",
        params: (_, state) =>
          parentId &&
          schema.dump(
            {
              [parentId]: state[name].buffer[parentId],
            },
            { partial: true },
          ),
        action: "initial_buffer",
        success: `onInitBuffer${model}Succeded_`,
        error: "noexiste",
      },
    ],
    [`loadInit${model}`]: [
      {
        type: "setStateKey",
        plug: payload => ({
          path: `${name}.data`,
          value: payload[`init${model}`],
        }),
      },
      {
        type: "grape",
        name: `loadBuffer${model}`,
      },
    ],
    [`loadBuffer${model}`]: [
      {
        type: "setStateKey",
        plug: (_, state) => ({
          path: `${name}.buffer`,
          value: { ...state[name].data },
        }),
      },
      {
        type: "grape",
        name: `onBuffer${model}Loaded`,
      },
    ],
    [`dumpBuffer${model}`]: [
      {
        type: "setStateKey",
        plug: (_, state) => ({
          path: `${name}.data`,
          value: { ...state[name].buffer },
        }),
      },
    ],
    [`initBuffer${model}`]: [
      {
        type: "get",
        schema,
        id: () => "-static-",
        params: (_, state) =>
          parentId &&
          schema.dump(
            {
              [parentId]: state[name].buffer[parentId],
            },
            { partial: true },
          ),
        action: "initial_buffer",
        success: `onInitBuffer${model}Succeded_`,
        error: "noexiste",
      },
    ],
    [`onInitBuffer${model}Succeded_`]: [`on${model}BufferChangedSucceded_`],
    [`setChangesForBuffer${model}`]: [
      {
        type: "grape",
        name: `on${model}BufferChanged`,
        plug: ({ changes }) => {
          const [change, ...changesLeft] = changes;

          return {
            changes: changesLeft,
            field: change.key,
            value: change.value,
          };
        },
      },
    ],
    [`call${model}BufferChanged`]: [
      {
        condition: ({ field, value }) => schema.validation({ [field]: value }, field) === false,
        type: "get",
        schema,
        partial: true,
        id: () => "-static-",
        action: "buffer_changed",
        params: ({ field, value }, state) => ({
          change: JSON.stringify(schema.dump({ [field]: value }, { partial: true })),
          buffer: JSON.stringify(
            schema.dump(state[name].buffer, {
              partial: true,
              includeNullish: false,
            }),
          ),
        }),
        success: `on${model}BufferChangedSucceded_`,
      },
    ],
    [`on${model}BufferChanged`]: [
      {
        condition: () => remoteBufferChanged,
        type: "grape",
        name: `call${model}BufferChanged`,
      },
      //
      {
        type: "setStateKey",
        plug: ({ field, value }) => ({
          path: `${name}.buffer.${field}`,
          value,
        }),
      },
      {
        type: "setStateKey",
        plug: ({ field }, state) => ({
          path: `${name}.bufferValidation.${field}`,
          value: schema.validation(state[name].buffer, field),
        }),
      },
    ],
    [`on${model}BufferChangedSucceded_`]: [
      {
        type: "setStateKey",
        plug: ({ response }, state) => ({
          path: `${name}.buffer`,
          value: { ...state[name].buffer, ...response.data },
        }),
        // plug: ({ response }, state) => ({ path: `${ name }.buffer`, value: { ...state[name].buffer, ...response.data, idLinea: state[name].buffer[id] } })
      },
      {
        condition: ({ changes }) => changes && changes.length,
        type: "grape",
        name: `setChangesForBuffer${model}`,
      },
    ],
    [`reload${model}`]: [
      {
        log: payload => ["reloading...", `reload${model}`],
        type: "get",
        schema,
        id: (_, state) => state[name].data[id],
        success: `onReload${model}Succeded_`,
        error: "noexiste",
      },
    ],
    [`onReload${model}Succeded_`]: [
      {
        type: "setStateKey",
        plug: ({ response }) => ({
          path: `${name}.data`,
          value: response.data[0],
        }),
      },
      {
        type: "grape",
        name: `loadBuffer${model}`,
      },
      {
        log: (_, state) => ["changedd reloaded ", `on${model}Changed_`],
        type: "grape",
        name: `on${model}Changed_`,
      },
    ],
    [`cancel${model}`]: [
      {
        // condition: (_, state) => !!state[name].callbackChanged,
        type: "setStateKey",
        plug: ({ onSuccess }, state) => {
          return {
            path: `${name}.event`,
            value: {
              ...state[name].event,
              serial: state[name].event.serial + 1,
              event: "cancelled",
              onSuccess,
            },
          };
        },
      },
    ],
    ...saveApi({
      name: `${name}Interno`,
      idPath: `${name}.buffer.${id}`,
      dataPath: `${name}.buffer`,
      schema,
      mode,
    }),
    [`onSave${model}Clicked`]: [
      {
        type: "grape",
        name: `save${model}`,
      },
    ],
    [`save${model}`]: [
      {
        log: (_, state) => ["reloading ", `save${model}`],
        type: "grape",
        name: `onSave${model}InternoClicked`,
      },
    ],
    [`on${model}InternoSaved`]: [
      {
        type: "grape",
        name: `dumpBuffer${model}`,
      },
      {
        // log: (_, state) => ['reloading ', `on${ model }InternoSaved`],
        type: "grape",
        name: `on${model}Saved_`,
      },
    ],
    [`onSave${model}InternoFailed`]: [
      {
        type: "grape",
        name: `onSave${model}Failed`,
      },
    ],
    [`onSave${model}Failed`]: [
      {
        type: "showMessage",
        plug: ({ response }) => ({
          mensaje: response,
          tipoMensaje: "error",
        }),
      },
    ],
    [`on${model}Changed_`]: [
      {
        // log: (_, state) => ['reloading changedd2 ', `on${ model }Changed_`, !!state[name].data[id]],
        // condition: (_, state) => !!state[name].data[id],
        condition: (_, state) => mode !== "insert",
        type: "setStateKey",
        plug: ({ onSuccess }, state) => {
          return {
            path: `${name}.event`,
            value: {
              ...state[name].event,
              serial: state[name].event.serial + 1,
              event: "edited",
              item: state[name].data,
              onSuccess,
            },
          };
        },
      },
      {
        // log: (_, state) => ['reloading changedd2 created', `on${ model }Changed_`, state[name].event.serial, (!state[name].data[id])],
        // condition: (_, state) => !state[name].data[id],
        condition: (_, state) => mode === "insert",
        type: "setStateKey",
        plug: ({ onSuccess, response }, state) => {
          return {
            path: `${name}.event`,
            value: {
              ...state[name].event,
              serial: state[name].event.serial + 1,
              event: "created",
              id: response.pk,
              onSuccess,
            },
          };
        },
      },
    ],
    [`on${model}Saved_`]: [
      {
        // log: (_, state) => ['reloading changedd saved ', `on${ model }Saved_`],
        type: "grape",
        name: `on${model}Changed_`,
      },
      {
        // log: (_, state) => ['reloading ', `on${ model }Saved_`],
        type: "grape",
        name: `on${model}Saved`,
      },
    ],
    ...deleteApi({
      name,
      path: `${name}.buffer`,
      id,
      schema,
      deleteConfirmQuestion,
    }),
    [`on${model}Deleted`]: [
      {
        // log: (_, state) => ['reloading changedd2 ', `on${ model }Deleted`],
        type: "setStateKey",
        plug: ({ onSuccess }, state) => {
          return {
            path: `${name}.event`,
            value: {
              ...state[name].event,
              serial: state[name].event.serial + 1,
              event: "deleted",
              item: state[name].data,
              onSuccess,
            },
          };
        },
      },
    ],
  };
};

const saveApi = ({ name, idPath, dataPath, schema, mode }) => {
  const model = util.camelId(name);

  // const meta = {
  //   slots: [
  //     { slot: 'onSaveModelClicked' },
  //     { slot: 'onSaveModel' },
  //   ],
  //   signals: [
  //     { signal: 'onModelSaved', desc: 'Modelo guardado', payload: { [idPath]: 'Id del modelo guardado' } },
  //     { signal: 'onSaveModelSucceded', desc: 'Igual a onModelSaved' },
  //   ]
  // }
  return {
    [`onSave${model}Clicked`]: [
      {
        log: (_, state) => ["reloading!! ", idPath, util.getStateValue(idPath, state)],
        type: "function",
        function: (_, state) => {
          const data = util.getStateValue(dataPath, state);
          const validation = schema?.validation?.(data) ?? { errors: false };

          return {
            validation,
            valid: Object.values(validation).every(v => !v),
            id: util.getStateValue(idPath, state),
            data,
            schema,
          };
        },
        success: `onSave${model}FunctionSucceded_`,
      },
    ],
    [`onSave${model}FunctionSucceded_`]: [
      {
        condition: ({ response }) => response.valid && mode !== "insert",
        type: "patch",
        schema: ({ response }) => response.schema,
        id: ({ response }, state) => response.id,
        data: ({ response }) => response.data,
        success: `onSave${model}Succeded_`,
      },
      {
        condition: ({ response }) => response.valid && mode === "insert",
        type: "post",
        schema: ({ response }) => response.schema,
        data: ({ response }) => response.data,
        success: `onSave${model}Succeded_`,
        error: `onSave${model}Failed`,
      },
      // {
      //   condition: ({ response }, state) => response.valid && response.id,
      //   type: "patch",
      //   schema: ({ response }) => response.schema,
      //   id: ({ response }, state) => response.id,
      //   data: ({ response }) => response.data,
      //   success: `onSave${ model }Succeded_`,
      // },
      // {
      //   condition: ({ response }, state) => response.valid && !response.id,
      //   type: "post",
      //   schema: ({ response }) => response.schema,
      //   data: ({ response }) => response.data,
      //   success: `onSave${ model }Succeded_`,
      // },
      {
        condition: ({ response }) => !response.valid,
        type: "grape",
        name: `onSave${model}Failed`,
        plug: ({ response }) => ({ validation: response.validation }),
      },
    ],
    [`onSave${model}Succeded_`]: [
      {
        // log: (_, state) => ['reloading ', `onSave${ model }Succeded_`],
        type: "grape",
        name: `on${model}Saved`,
      },
      {
        type: "grape",
        name: `onSave${model}Succeded`,
      },
    ],
  };
};

const deleteItemCtrl = () => {};

const deleteItemApi = ({ name, path, id, current, schema, deleteConfirmQuestion = {} }) => {
  const model = util.camelId(name);
  const _schema = typeof schema === "string" ? getSchemas()[schema] : schema;

  return {
    [`onDelete${model}ItemClicked`]: [`confirmDeleteItem${model}`],
    [`confirmDeleteItem${model}`]: [
      {
        type: "userConfirm",
        question: () => ({
          // type: 'text',
          titulo: "Borrar registro",
          cuerpo: "El registro se borrará",
          textoSi: "CONFIRMAR",
          textoNo: "CANCELAR",
          ...deleteConfirmQuestion,
        }),
        onConfirm: `deleteItem${model}`,
      },
    ],
    [`deleteItem${model}`]: [
      {
        type: "setStateKey",
        plug: (payload, state) => {
          const currentValue = util.getStateValue(`item.${id}`, payload);

          return { path: `${path}.${currentValue}._status`, value: "deleting" };
        },
      },
      {
        type: "delete",
        schema: _schema,
        id: (payload, state) => util.getStateValue(`item.${id}`, payload),
        success: `onDeleteItem${model}Succeded_`,
      },
    ],
    [`onDeleteItem${model}Succeded_`]: [`on${model}ItemDeleted`],
  };
};

const deleteCtrl = () => {};

const deleteApi = ({ name, path, id, schema, deleteConfirmQuestion }) => {
  const model = util.camelId(name);
  const _schema = typeof schema === "string" ? getSchemas()[schema] : schema;

  return {
    [`onDelete${model}Clicked`]: [`confirmDelete${model}`],
    [`confirmDelete${model}`]: [
      {
        type: "userConfirm",
        question: () => ({
          // type: 'text',
          titulo: "Borrar registro",
          cuerpo: "El registro se borrará",
          textoSi: "CONFIRMAR",
          textoNo: "CANCELAR",
          ...deleteConfirmQuestion,
        }),
        onConfirm: `delete${model}`,
      },
    ],
    [`delete${model}`]: [
      {
        type: "setStateKey",
        plug: () => ({ path: `${path}._status`, value: "deleting" }),
      },
      {
        type: "delete",
        schema: _schema,
        id: (_, state) => util.getStateValue(`${path}.${id}`, state),
        success: `onDelete${model}Succeded_`,
      },
    ],
    [`onDelete${model}Succeded_`]: [`on${model}Deleted`, `onDelete${model}Succeded`],
  };
};

//

const shortcutsDict = {
  DetailBuffer: {
    ctrl: detailBufferCtrl,
    bunch: detailBufferApi,
  },
  Model: {
    ctrl: modelCtrl,
    bunch: modelApi,
  },
  Delete: {
    ctrl: deleteCtrl,
    bunch: deleteApi,
  },
  DeleteItem: {
    ctrl: deleteItemCtrl,
    bunch: deleteItemApi,
  },
};

const shortcutsState = shortcuts => {
  if (!shortcuts) {
    return {};
  }

  return shortcuts.reduce((previo, nuevo) => {
    return nuevo.name
      ? {
          ...previo,
          [nuevo.name]: { ...shortcutsDict[nuevo.type].ctrl(nuevo) },
        }
      : previo;
  }, {});
};

const shortcutsBunch = shortcuts => {
  if (!shortcuts) {
    return {};
  }

  return shortcuts.reduce((previo, nuevo) => {
    return { ...previo, ...shortcutsDict[nuevo.type].bunch(nuevo) };
  }, {});
};

// const shortcutsState = (shortcuts) => {
//   if (!shortcuts) return {}
//   return shortcuts.reduce((previo, nuevo) => {
//     const f = shortcutsDict[nuevo.type].ctrl
//     return nuevo.stateKey
//       ? { ...previo, [nuevo.stateKey]: { ...f(nuevo.stateParam) } }
//       : previo
//   }, {})
// }

// const shortcutsBunch = (shortcuts) => {
//   if (!shortcuts) return {}
//   return shortcuts.reduce((previo, nuevo) => {
//     const f = shortcutsDict[nuevo.type].bunch
//     return { ...previo, ...f({ ...nuevo.bunchParams }) }
//   }, {})
// }

/*
Cuando sobreescribimos una clave del bunch, podemos o bien sustituir el anterior (override), o bien incluir nuestra clave antes (prepend) o después (append) de la clave padre.
Ejemplo 1:
bunch = {
  clave: [
    ...grapes
  ]
}
Este es el caso por defecto, clave se coloca después (append) de la clave del padre

Ejemplo 2:
bunch = {
  clave: {
    patch: 'override',
    grapes: [
      ...grapes
    ]
  }
}
Este es el caso manual, clave se coloca antes, después o sobreescribe, en función de la propiedad patch a la clave del padre
*/
const applyBunch = (bunch, parent) => {
  let result = { ...parent };
  for (const key in bunch) {
    const grapes = Array.isArray(bunch[key]) ? bunch[key] : bunch[key].grapes;
    const patchType = Array.isArray(bunch[key]) ? "append" : bunch[key].patch;
    const parentGrapes = key in parent ? parent[key] : [];
    result = {
      ...result,
      [key]:
        patchType === "prepend"
          ? [...grapes, ...parentGrapes]
          : patchType === "override"
            ? [...grapes]
            : [...parentGrapes, ...grapes],
    };
  }

  return result;
};

export {
  applyBunch,
  detailApi as DetailAPI,
  detailBufferApi as DetailBufferAPI,
  detailBufferCtrl as DetailBufferCtrl,
  detailCtrl as DetailCtrl,
  masterApi as MasterAPI,
  masterCtrl as MasterCtrl,
  modelApi as ModelAPI,
  modelCtrl as ModelCtrl,
  shortcutsBunch,
  shortcutsState,
};
