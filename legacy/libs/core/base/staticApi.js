// import util from '../util'
import { getSchemas, useAppValue, util } from "../";

export function interpreter(grapeParam, payload, state) {
  const grape = typeof grapeParam === "string" ? grapeParam : { ...grapeParam };

  if (typeof grape === "string") {
    return {
      type: "grape",
      name: grape,
    };
  }
  const { condition, type } = grape;
  if (typeof condition === "function") {
    return grape;
  }
  if (condition) {
    if (conditionChecks({ payload, state, condition })) {
      delete grape.condition;
    } else {
      return {
        ...grape,
        condition: () => false,
      };
    }
  }

  if ("_type" in grape) {
    const grapeType = grape._type;
    if (grapeType in staticGrapes) {
      return staticGrapes[grapeType]({ state, payload, grape });
    }
  }

  const grapeType = Object.keys(grape)[0];
  if (grapeType in staticGrapes && !("type" in grape)) {
    return staticGrapes[grapeType]({ state, payload, grape });
  }

  if (type === "setStateKey" && typeof grape.plug !== "function") {
    const { path, value } = grape.plug;
    const valueType = Object.keys(value)[0];
    if (typeof path === "string" && valueType in keyValueTypes) {
      return {
        ...grape,
        plug: (payload, state) => ({
          path,
          value: getValue({ payload, state, value }),
        }),
      };
    }
  }

  return grape;
}

function getFilter({ payload, state, filter }) {
  if (Array.isArray(filter)) {
    return filter.map(f => (typeof f === "string" ? f : getValue({ payload, state, value: f })));
  }
  const nuevoFiltro = {};
  for (const key1 in filter) {
    nuevoFiltro[key1] = filter[key1].map(clausula =>
      getFilter({ payload, state, filter: clausula }),
    );
  }

  return nuevoFiltro;
}

function getValue({ payload, state, value }) {
  const valueType = Object.keys(value)[0];
  const valueParam = value[valueType];

  return valueType in keyValueTypes
    ? keyValueTypes[valueType]({ payload, state, value: valueParam })
    : valueParam;
}

function getPlug({ payload, state, valueDict }) {
  const plug = { ...payload };
  if (valueDict) {
    Object.keys(valueDict).map(
      key => (plug[key] = getValue({ payload, state, value: valueDict[key] })),
    );
  }

  return plug;
}

function getValue_old({ payload, state, value, valueType }) {
  return valueType in keyValueTypes ? keyValueTypes[valueType]({ payload, state, value }) : value;
}

function getFunction(fun, params, payload, state) {
  const valueType = Object.keys(fun)[0];
  const valueParam = fun[valueType];
  const paramsDict = getFunctionParams(params, payload, state);
  if (valueType in functionTypes) {
    return () => functionTypes[valueType]({ state, payload, value: valueParam })(paramsDict);
  }

  return () => value(getFunctionParams(params, payload, state));
}

function getFunctionParams(params, payload, state) {
  const p = params.reduce(
    (prev, actual) => ({
      ...prev,
      [actual.key]: getValue({ payload, state, value: actual.value }),
    }),
    {},
  );

  return p;
}

function getParamValues(params, payload, state) {
  const v = params.map(param => ({
    key: param.key,
    value: getValue({ payload, state, value: param.value }),
  }));

  return v;
}

export function conditionChecks({ payload, state, condition }) {
  if ("operator" in condition) {
    return boolExpressions[condition.operator]({ payload, state, condition });
  }
  if ("and" in condition) {
    return condition.and.reduce(
      (previo, actual) => conditionChecks({ payload, state, condition: actual }) && previo,
      true,
    );
  }
  if ("or" in condition) {
    return condition.and.reduce(
      (previo, actual) => conditionChecks({ payload, state, condition: actual }) || previo,
      false,
    );
  }
}

const boolExpressions = {
  "A = B": ({ state, payload, condition }) =>
    getValue({ state, payload, value: condition.A }) ===
    getValue({ state, payload, value: condition.B }),
  "A in list B": ({ state, payload, condition }) =>
    getValue({ state, payload, value: condition.B }).includes(
      getValue({ state, payload, value: condition.A }),
    ),
  "not A": ({ state, payload, condition }) => !getValue({ state, payload, value: condition.A }),
  "A is defined": ({ state, payload, condition }) =>
    !!getValue({ state, payload, value: condition.A }),
  "A is true": ({ state, payload, condition }) =>
    getValue({ state, payload, value: condition.A }) === true,
  "list A is not empty": ({ state, payload, condition }) =>
    getValue({ state, payload, value: condition.A }).length > 0,
  "list A is empty": ({ state, payload, condition }) =>
    getValue({ state, payload, value: condition.A }).length == 0,
  "schema is invalid for A": ({ state, payload, condition }) =>
    !getSchemas()[condition.schema].isValid(getValue_old({ state, payload, ...condition.A })),
  "mediaWidth in [xs, sm]": ({ state, payload, condition }) =>
    boolExpressions["A in list B"]({
      state,
      payload,
      condition: {
        operator: "A in list B",
        A: {
          mediaWidth: null,
        },
        B: {
          const: ["xs", "sm"],
        },
      },
    }),
};

const functionTypes = {
  value: ({ value }) => value,
  payloadPath: ({ payload, value }) => util.getStateValue(value, payload),
  payloadPathOrZero: ({ payload, value }) => util.getStateValue(value, payload) ?? 0,
  statePath: ({ state, value }) => util.getStateValue(value, state),
};

const keyValueTypes = {
  cleanSchema: ({ value }) => getSchemas()[value].load({}),
  const: ({ value }) => value,
  code: ({ payload, state, value }) => Function("payload", "state", value)(payload, state),
  loadSchema: ({ payload, state, value }) => {
    const v = getSchemas()[value.schema].load(getValue({ state, payload, value: value.data }));

    return v;
  },
  params: ({ payload, state, value }) => getFunctionParams(value, payload, state),
  paramValues: ({ payload, state, value }) => getParamValues(value, payload, state),
  payloadPath: ({ payload, value }) => util.getStateValue(value, payload),
  payloadPathOrZero: ({ payload, value }) => util.getStateValue(value, payload) ?? 0,
  statePath: ({ state, value }) => util.getStateValue(value, state),
  appStatePath: ({ state, value }) => {
    const [appState] = useAppValue();

    return util.getStateValue(value, appState);
  },
  toggleStatePath: ({ state, value }) => !util.getStateValue(value, state),
  value: ({ value }) => value,
  mediaWidth: () => util.getMediaWidth(),
  localStorageValue: ({ value }) => {
    const partes = value.split(".");
    const [key, ...resto] = partes;
    const valor = util.getGlobalSetting(key);

    return partes.length > 1 ? util.getStateValue(resto.join("."), valor) : valor;
  },
};

const staticGrapes = {
  alert: ({ state, payload, grape }) => {
    const { text, severity } = grape;

    return {
      type: "showMessage",
      plug: () => ({ mensaje: text, tipoMensaje: severity }),
    };
  },
  appDispatch: ({ state, payload, grape }) => {
    const { name } = grape;
    const plug = getPlug({ payload, state, valueDict: grape.payload });

    return {
      type: "appDispatch",
      name,
      plug: () => plug,
    };
  },
  appendItem: ({ grape }) => {
    const { path, value } = grape;

    return {
      type: "setStateKey",
      plug: (payload, state) => ({
        path,
        value: [
          ...getValue({ payload, state, value: { statePath: path } }),
          getValue({ payload, state, value }),
        ],
      }),
    };
  },
  call: ({ state, payload, grape }) => {
    const fun = grape.function;
    const params = grape?.params || [];

    return {
      type: "function",
      function: getFunction(fun, params, payload, state),
    };
  },
  deleteItemByIndex: ({ grape }) => {
    const { path, index } = grape;

    return {
      type: "setStateKey",
      plug: (payload, state) => ({
        path,
        value: getValue({ payload, state, value: { statePath: path } }).filter(
          (_item, idx) => idx !== getValue({ payload, state, value: index }),
        ),
      }),
    };
  },
  download: ({ grape }) => {
    const { params, schema, action, filename, success, error } = grape;
    const paramsValue = params
      ? (payload, state) => getFunctionParams(params, payload, state)
      : null;

    return {
      type: "download",
      schema: getSchemas()[schema],
      action,
      params: paramsValue,
      fileName: filename ? (payload, state) => getValue({ payload, state, value: filename }) : null,
      success,
      error,
    };
  },
  get: ({ grape }) => {
    const { id, data, filter, schema, action, success, error } = grape;
    // const dataKey = data ? (payload, state) => getFunctionParams(data, payload, state) : null;

    return {
      type: "get",
      schema: getSchemas()[schema],
      action,
      id: (payload, state) =>
        id ? getValue({ payload, state, value: id }) : filter ? null : "-static-",
      filter: (payload, state) => (filter ? getFilter({ payload, state, filter }) : null),
      // params: dataKey,
      success,
      error,
    };
  },
  grape: ({ state, payload, grape }) => {
    if (typeof grape.grape === "string") {
      return {
        type: "grape",
        name: grape.grape,
      };
    }
    const { name } = grape;
    // const _payload = grape.payload
    // const plug = {}
    // if (_payload) {
    //   Object.keys(_payload).map(key => plug[key] = getValue({ payload, state, value: _payload[key] }))
    // }
    const plug = getPlug({ payload, state, valueDict: grape.payload });

    return {
      type: "grape",
      name,
      plug: () => plug,
    };
  },
  if: ({ state, payload, grape }) => {
    const _if = grape.if;
    const _then = grape.then;
    const _else = grape.else;
    if (conditionChecks({ payload, state, condition: _if })) {
      return interpreter(_then, payload, state);
    }
    if (_else) {
      return interpreter(_else, payload, state);
    }

    return {
      ...grape,
      condition: () => false,
    };
  },
  log: ({ grape }) => {
    const { desc, value } = grape;

    return {
      log: (payload, state) => ["LOGGING", desc, getValue({ payload, state, value })],
      type: "none",
    };
  },
  navigate: ({ state, payload, grape }) => {
    const { url } = grape;
    const urlValue = getValue({ payload, state, value: url });

    return {
      type: urlValue.substring(0, 4) === "http" ? "newtab" : "navigate",
      url: () => urlValue,
    };
  },
  patch: ({ grape }) => {
    const { action, data, files, id, schema, success, error } = grape;
    const dataKey = data ? (payload, state) => getFunctionParams(data, payload, state) : null;

    return {
      type: "patch",
      schema: getSchemas()[schema],
      action,
      files: (payload, state) => (files ? getValue({ payload, state, value: files }) : null),
      id: (payload, state) => (id ? getValue({ payload, state, value: id }) : null),
      data: dataKey,
      success,
      error,
    };
  },
  post: ({ grape }) => {
    const { action, data, schema, success, error, params } = grape;

    return {
      type: "post",
      schema: getSchemas()[schema],
      action,
      data: (payload, state) => getFunctionParams(data, payload, state),
      success,
      error,
    };
  },
  set: ({ grape }) => {
    const { path, value } = grape;

    return {
      type: "setStateKey",
      plug: (payload, state) => ({
        path,
        value: getValue({ payload, state, value }),
      }),
    };
  },
  setItem: ({ state, payload, grape }) => {
    const { path, value, key, prop } = grape;
    const propValue = getValue({ payload, state, value: prop });
    const keyValue = getValue({ payload, state, value: key });
    const p = `${path}.${keyValue}.${propValue}`;

    return {
      type: "setStateKey",
      plug: (payload, state) => ({
        path: p,
        value: getValue({ payload, state, value }),
      }),
    };
  },
  setToLocalStorage: ({ payload, state, grape }) => {
    const { key, value } = grape;
    const keyValue = getValue({ payload, state, value });

    return {
      type: "function",
      function: () => {
        util.setGlobalSetting(key, keyValue);
      },
    };
  },
  smTransition: ({ state, payload, grape }) => {
    const { current, target, actions } = grape;
    if (state.smState !== current) {
      return {
        ...grape,
        condition: () => false,
      };
    }

    return [
      ...(actions ?? []),
      {
        _type: "set",
        path: "smState",
        value: {
          const: target,
        },
      },
    ];
  },
};

// if (grapeType === 'set') {
//   const { path, value } = grape.set
//   return {
//     type: "setStateKey",
//     plug: (payload, state) => ({
//       path,
//       value: getValue({ payload, state, value })
//     })
//   }
// }

// if (grapeType === 'call') {
//   const fun = grape.call.function
//   const params = grape.call?.params || []
//   return {
//     type: "function",
//     function: getFunction(fun, params)
//   }
// }

// if (grapeType === 'grape') {
//   const grapeName = grape.grape
//   return {
//     type: "grape",
//     name: grape.grape
//   }
// }

// if (grapeType === 'navigate') {
//   return {
//     type: "navigate",
//     url: () => getValue({ payload, state, value: grape.navigate })
//   }
// }
