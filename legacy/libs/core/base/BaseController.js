import { API } from "../lib";
import util from "../util";
import { navigate } from "./router";
import { interpreter } from "./staticApi";

export default class BaseController {
  // state = {}
  // initialState = {}

  constructor(s) {
    // this.state = s
    // this.initialState = { ...s }
  }

  onInit(state) {
    return state;
  }

  // setState(s) {
  //   // this.state = s
  //   return s
  // }

  deepUpdate(state, keys, value) {
    if (!keys.length) {
      return value;
    }
    const [key, ...rest] = keys;

    return {
      ...state,
      [key]: this.deepUpdate(state[key], rest, value),
    };
  }

  onError(state, payload) {
    util.appDispatch({
      type: "onErrorProducido",
      payload: { error: payload.error, type: payload.type },
    });

    return state;
  }

  setListItem(state, { path, key, item }) {
    return {
      ...state,
      [path]: state[path].map(i => (i[key.name] === key.value ? item : i)),
    };
  }

  prependListItem(state, { path, item }) {
    return {
      ...state,
      [path]: [item, ...state[path]],
    };
  }

  onObjectKeySaved(state, payload) {
    const { changes, keyName } = payload;
    const copyKey = `${keyName}Copy`;
    // const copyKey = 'copy'
    if (!(copyKey in state)) {
      return state;
    }
    const newState = { ...state };
    newState[copyKey] = {
      ...newState[copyKey],
      ...changes,
    };

    return newState;
  }

  saveStateKey(state, { path, key, value }) {
    if (!state[path]) {
      return state;
    }
    const newState = { ...state };
    newState[path][key] = value;

    return newState;
  }

  saveStateKeys(state, payload) {
    const { changes, path } = payload;
    if (!(path in state)) {
      return state;
    }
    const newState = { ...state };
    newState[path] = {
      ...newState[path],
      ...changes,
    };

    return newState;
  }

  setStateKey(state, { path, value }) {
    if (path === undefined && value === undefined) {
      return state;
    }
    const newState = this.deepUpdate(state, path.split("."), value);

    return newState;
  }

  setStateKeys(state, { path, keys }) {
    // Asumimos solo claves de primer nivel (sin path). Para implementar el path usar función recursiva
    const newState = path
      ? {
          ...state,
          [path]: {
            ...state[path],
            ...keys,
          },
        }
      : {
          ...state,
          ...keys,
        };

    return newState;
  }

  setStateArrayKey(state, { path, value }) {
    return this.deepUpdate(state, path.split("."), [...value]);
  }

  filterListItems(state, { path, filter }) {
    return {
      ...state,
      [path]: state[path].filter(filter),
    };
  }

  //   import { API } from '../lib'
  // import { navigate } from 'quimera'
  // import { interpreter } from './staticApi'
  // import util from '../util'

  // export default class BaseApi {
  //   controller = null

  //   constructor(c) {
  //     this.controller = c
  //   }

  newAPI(name, replacers = []) {
    let replacedName = name;
    replacers.map(replacer => {
      replacedName = replacedName.replace("{}", replacer);
    });

    return API(replacedName);
  }

  isFunction(fn) {
    return fn && {}.toString.call(fn) === "[object Function]";
  }

  // getState() {
  //   return this.controller.state
  // }

  patch(
    schema,
    dispatch,
    state,
    { key, changes, action = null, files = null, success = null, error = null },
  ) {
    let api = this.newAPI(schema.name)
      .api(schema.api)
      .patch(key, action)
      .setKeys(action ? changes : schema.dump(changes, { partial: true }));

    if (files) {
      api = api.setFiles(files);
    }
    if (success) {
      api = api.success(r => success(r));
    }

    if (error) {
      api = api.error(r => error(r));
    }

    api.go(schema.onChanged, dispatch);
  }

  delete(schema, dispatch, { key, success = null, error = null }) {
    let api = this.newAPI(schema.name).api(schema.api).delete(key);

    if (success) {
      api = api.success(r => success(r));
    }

    if (error) {
      api = api.error(r => error(r));
    }

    api.go("", dispatch);
  }

  post(schema, dispatch, state, { data, action = null, success = null, error = null }) {
    let api = this.newAPI(schema.name).api(schema.api).post(schema.dump(data, state), action);

    if (success) {
      api = api.success(r => success(r));
    }

    if (error) {
      api = api.error(r => error(r));
    }

    api.go(schema.onCreated, dispatch);
  }

  // const sch = this.isFunction(grape.schema) ? grape.schema(payload, state) : grape.schema
  // let api = API(sch.name)
  //   .get(grape.pk ? grape.pk(payload, state): '-static-', grape.action)

  // if (grape.params) {
  //   api = api.setKeys(grape.params(payload, state))
  // }
  // if (grape.filter) {
  //   api = api.filter(grape.filter(payload, state))
  // }

  download(
    schema,
    dispatch,
    { action, params = null, filter = null, filename = null, success = null, error = null },
  ) {
    let api = this.newAPI(schema.name).api(schema.api).get("-static-", action);

    if (params) {
      api = api.setKeys(params);
    }
    if (filter) {
      api = api.filter(filter);
    }
    if (success) {
      api = api.success(r => success(r));
    }

    if (error) {
      api = api.error(r => error(r));
    }

    api.download("", filename, dispatch);

    // _method, apiUrl, data, filename, success, error, api
  }

  get(
    schema,
    dispatch,
    {
      filter = null,
      pk = null,
      order = null,
      page = null,
      params = null,
      action = null,
      partial = false,
      success = null,
      error = null,
    },
  ) {
    let api = this.newAPI(schema.name)
      .api(schema.api)
      .get(pk || null, action || null)
      .select(schema.fields);

    if (filter) {
      api = api.filter(filter);
    }
    if (success) {
      api = api.success(r => {
        const data = r.data
          ? Array.isArray(r.data)
            ? r.data.map(d => schema.load(d, { partial }))
            : schema.load(r.data, { partial })
          : null;
        const resource = pk ? (Array.isArray(data) && data.length == 1 ? data[0] : null) : null;

        return success({
          ...r,
          data,
          resource,
        });
      });
    } else {
      api = api.success(response => {
        const data = response.data.map(d => schema.load(d, { partial }));
        dispatch({
          type: schema.onLoaded,
          payload: { data, schema },
        });
      });
    }

    if (error) {
      api = api.error(r => error(r));
    } else {
      api = api.error(r => console.log("Fetch error"));
    }

    if (params) {
      api = api.setKeys(params);
    }
    if (order) {
      api = api.order(`${order.field} ${order.direction}`);
    } else if (schema.order) {
      api = api.order(`${schema.order.field} ${schema.order.direction}`);
    }
    api = api.page(page || schema.page || null);
    api.go(schema.onLoaded, dispatch);
  }

  eat(state, type, payload, dispatch) {
    if (!(type in this.bunch)) {
      if (type.startsWith("on") && type.endsWith("Changed")) {
        return this.eatGrape(
          state,
          {
            type: "setStateKey",
            plug: ({ field, value }) => ({ path: field, value }),
          },
          payload || {},
          dispatch,
        );
      }

      return state;
    }
    const actions = this.bunch[type];

    // actions.map(a => this.eatGrape(a, payload || {}, dispatch))
    return actions.reduce(
      (acum, item) => this.eatGrape(acum, item, payload || {}, dispatch),
      state,
    );
  }

  eatGrape(state, grape, payload, dispatch) {
    // const state = this.getState()

    grape = interpreter(grape, payload, state);
    if (Array.isArray(grape)) {
      // grape.map(g => this.eatGrape(g, payload, dispatch))
      // return
      return grape.reduce(
        (acum, item) => this.eatGrape(acum, item, payload || {}, dispatch),
        state,
      );
    }

    if (grape.log) {
      console.log(grape.log(payload, state));
    }

    if (grape.condition && !grape.condition(payload, state)) {
      return state;
    }

    switch (grape.type) {
      case "get":
        if (grape.pk) {
          console.error('Quimera deprecated grape key "pk" for type "get". Use "id" instead');
          grape.id = grape.pk;
        }
        const schema =
          typeof grape.schema === "function" ? grape.schema(payload, state) : grape.schema;
        this.get(schema, dispatch, {
          filter: grape.filter ? grape.filter(payload, state) : null,
          pk: grape.id ? grape.id(payload, state) : null,
          params: grape.params ? grape.params(payload, state) : null,
          action: grape.action,
          partial: grape.partial ?? false,
          order: grape.order
            ? grape.order(payload, state)
            : schema.order
              ? schema.order(payload, state)
              : null,
          page: grape.page ? grape.page(payload, state) : null,
          success: response => {
            Array.isArray(grape.success)
              ? grape.success.map(a => this.eatGrape(a, { ...payload, response }, dispatch))
              : dispatch({
                  type: grape.success,
                  payload: { ...payload, response },
                });
          },
          error: response => {
            grape.error
              ? Array.isArray(grape.error)
                ? grape.error.map(a => this.eatGrape(a, { ...payload, response }, dispatch))
                : dispatch({
                    type: grape.error,
                    payload: { ...payload, response },
                  })
              : util.appDispatch({
                  type: "mostrarMensaje",
                  payload: { mensaje: response, tipoMensaje: "error" },
                });
          },
        });
        break;

      case "patch":
        if (grape.key) {
          console.error('Quimera deprecated grape key "key" for type "patch". Use "id" instead');
          grape.id = grape.key;
        }
        this.patch(
          this.isFunction(grape.schema) ? grape.schema(payload, state) : grape.schema,
          dispatch,
          state,
          {
            key: grape.id(payload, state),
            changes: grape.data ? grape.data(payload, state) : {},
            action: grape.action || null,
            files: grape.files && grape.files(payload, state),
            success: response => {
              Array.isArray(grape.success)
                ? grape.success.map(a => this.eatGrape(a, { ...payload, response }, dispatch))
                : dispatch({
                    type: grape.success,
                    payload: { ...payload, response },
                  });
            },
            error: response => {
              grape.error
                ? Array.isArray(grape.error)
                  ? grape.error.map(a => this.eatGrape(a, { ...payload, response }, dispatch))
                  : dispatch({
                      type: grape.error,
                      payload: { ...payload, response },
                    })
                : util.appDispatch({
                    type: "mostrarMensaje",
                    payload: { mensaje: response, tipoMensaje: "error" },
                  });
            },
          },
        );
        break;

      case "post":
        this.post(
          this.isFunction(grape.schema) ? grape.schema(payload, state) : grape.schema,
          dispatch,
          state,
          {
            data: grape.data(payload, state),
            action: grape.action || null,
            success: response => {
              Array.isArray(grape.success)
                ? grape.success.map(a => this.eatGrape(a, { ...payload, response }, dispatch))
                : dispatch({
                    type: grape.success,
                    payload: { ...payload, response },
                  });
            },
            error: response => {
              grape.error
                ? Array.isArray(grape.error)
                  ? grape.error.map(a => this.eatGrape(a, { ...payload, response }, dispatch))
                  : dispatch({
                      type: grape.error,
                      payload: { ...payload, response },
                    })
                : util.appDispatch({
                    type: "mostrarMensaje",
                    payload: { mensaje: response, tipoMensaje: "error" },
                  });
            },
          },
        );
        break;

      case "delete":
        if (grape.key) {
          console.error('Quimera deprecated grape key "key" for type "delete". Use "id" instead');
          grape.id = grape.key;
        }
        this.delete(
          this.isFunction(grape.schema) ? grape.schema(payload, state) : grape.schema,
          dispatch,
          {
            key: grape.id && grape.id(payload, state),
            success: response => {
              Array.isArray(grape.success)
                ? grape.success.map(a => this.eatGrape(a, { ...payload, response }, dispatch))
                : dispatch({
                    type: grape.success,
                    payload: { ...payload, response },
                  });
            },
            error: response => {
              grape.error
                ? Array.isArray(grape.error)
                  ? grape.error.map(a => this.eatGrape(a, { ...payload, response }, dispatch))
                  : dispatch({
                      type: grape.error,
                      payload: { ...payload, response },
                    })
                : util.appDispatch({
                    type: "mostrarMensaje",
                    payload: { mensaje: response, tipoMensaje: "error" },
                  });
            },
          },
        );
        break;

      case "download":
        this.download(
          this.isFunction(grape.schema) ? grape.schema(payload, state) : grape.schema,
          dispatch,
          {
            action: grape.action || null,
            params: grape.params ? grape.params(payload, state) : {},
            filter: grape.filter ? grape.filter(payload, state) : null,
            filename: grape.fileName ? grape.fileName(payload, state) : "file",
            success: response => {
              if (grape.success) {
                Array.isArray(grape.success)
                  ? grape.success.map(a => this.eatGrape(a, { ...payload, response }, dispatch))
                  : dispatch({
                      type: grape.success,
                      payload: { ...payload, response },
                    });
              }
            },
            error: response => {
              grape.error
                ? Array.isArray(grape.error)
                  ? grape.error.map(a => this.eatGrape(a, { ...payload, response }, dispatch))
                  : dispatch({
                      type: grape.error,
                      payload: { ...payload, response },
                    })
                : util.appDispatch({
                    type: "mostrarMensaje",
                    payload: { mensaje: response, tipoMensaje: "error" },
                  });
            },
          },
        );
        break;

      case "dispatch":
        if (grape.name === "setStateKey") {
          console.error(
            'Quimera deprecated grape key "setStateKey" for type "dispatch". Use "setStateKey" type instead',
          );
        }
        if (grape.name === "setStateKeys") {
          console.error(
            'Quimera deprecated grape key "setStateKeys" for type "dispatch". Use "setStateKeys" type instead',
          );
        }
        dispatch({
          type: grape.name,
          payload: grape.plug ? grape.plug(payload, state) : payload.response,
        });
        break;

      case "appDispatch":
        if (grape.name === "setNombrePaginaActual") {
          console.error(
            'Quimera deprecated grape key "setNombrePaginaActual" for type "appDispatch". Use "setPageName" type instead',
          );
        }
        if (grape.name === "mostrarMensaje") {
          console.error(
            'Quimera deprecated grape key "mostrarMensaje" for type "appDispatch". Use "showMessage" type instead',
          );
        }
        util.appDispatch({
          type: grape.name,
          payload: grape.plug ? grape.plug(payload, state) : payload.response,
        });
        break;

      case "setPageName":
        util.appDispatch({
          type: "setNombrePaginaActual",
          payload: grape.plug ? grape.plug(payload, state) : payload.response,
        });
        break;

      case "showMessage":
        util.appDispatch({
          type: "mostrarMensaje",
          payload: grape.plug ? grape.plug(payload, state) : payload.response,
        });
        break;

      case "setStateKey":
        return this.setStateKey(state, grape.plug ? grape.plug(payload, state) : payload.response);

      case "setStateKeys":
        return this.setStateKeys(state, grape.plug ? grape.plug(payload, state) : payload.response);

      case "function":
        if (!grape.function) {
          console.log("Has creado un grape de tipo function sin valores para function");
          break;
        }
        const response = grape.plug
          ? grape.function(grape.plug(payload, state))
          : grape.function(payload, state);
        // grape.success && grape.success.map(a => this.eatGrape(a, { ...payload, response: response }, dispatch))
        if (grape.success) {
          if (Array.isArray(grape.success)) {
            return grape.success.reduce(
              (acum, item) => this.eatGrape(acum, item, { ...payload, response } || {}, dispatch),
              state,
            );
          }
          dispatch({
            type: grape.success,
            payload: { ...payload, response },
          });

          // actions.reduce((acum, item) => this.eatGrape(acum, item, payload || {}, dispatch), state)
        }
        break;

      case "navigate":
        if (!grape.url) {
          console.log("Has creado un grape de tipo navigate sin valores para url");
          break;
        }
        const url = grape.url(payload, state);
        if (url.startsWith("/")) {
          navigate(url);
        } else {
          window.location = url;
        }
        break;

      case "redirect":
        if (!grape.url) {
          console.log("Has creado un grape de tipo navigate sin valores para url");
          break;
        }
        navigate(grape.url(payload, state));
        break;

      case "newtab":
        if (!grape.url) {
          console.log("Has creado un grape de tipo newtab sin valores para url");
          break;
        }
        window.open(grape.url(payload, state), "_blank");
        break;

      case "regrape":
        console.error('Quimera deprecated grape type "regrape". Use grape instead');
      case "grape":
        if (!grape.grape && !grape.name) {
          console.log("Has creado un grape de tipo grape sin valores para name");
          break;
        }
        if (grape.grape) {
          console.error(
            'Quimera deprecated grape attribute "grape" for type "grape". Use "name" instead',
          );
          grape.name = grape.grape;
        }

        return this.eat(
          state,
          grape.name,
          grape.plug ? { ...payload, ...grape.plug(payload, state) } : payload,
          dispatch,
        );

      case "action":
        if (!grape.action) {
          console.log("Has creado un grape de tipo action sin valores para action");
          break;
        }

        return grape.action
          ? grape.action.reduce(
              (acum, item) => this.eatGrape(acum, item, payload || {}, dispatch),
              state,
            )
          : state;
      // grape.action.map(a => this.eatGrape(a, { ...payload }, dispatch))

      case "print":
        if (!grape.printerUrl) {
          console.log("Has creado un grape de tipo print sin valores para printerUrl");
          break;
        }
        if (!grape.printerAlias) {
          console.log("Has creado un grape de tipo print sin valores para printerAlias");
          break;
        }
        if (!grape.reportAlias) {
          console.log("Has creado un grape de tipo print sin valores para reportAlias");
          break;
        }
        if (!grape.data) {
          console.log("Has creado un grape de tipo print sin valores para data");
          break;
        }

        let api = API(grape.printerUrl(payload, state))
          .api("custom")
          .post({
            method: "requestDispatcher",
            params: {
              type: "new_job",
              arguments: {
                printer: grape.printerAlias(payload, state),
                model: grape.reportAlias(payload, state),
                data: grape.data(payload, state),
              },
            },
            jsonrpc: "2.0",
            id: 0,
          });

        if (grape.success) {
          const success = response =>
            Array.isArray(grape.success)
              ? grape.success.map(a => this.eatGrape(a, { ...payload, response }, dispatch))
              : dispatch({
                  type: grape.success,
                  payload: { ...payload, response },
                });
          api = api.success(r => success(r));
        }
        if (grape.error) {
          const error = response =>
            grape.error
              ? Array.isArray(grape.error)
                ? grape.error.map(a => this.eatGrape(a, { ...payload, response }, dispatch))
                : dispatch({
                    type: grape.error,
                    payload: { ...payload, response },
                  })
              : util.appDispatch({
                  type: "mostrarMensaje",
                  payload: { mensaje: response, tipoMensaje: "error" },
                });
          api = api.error(r => error(r));
        }
        api.go("", dispatch);
        break;

      case "userConfirm":
        if (!grape.question) {
          console.log("Has creado un grape de tipo userConfirm sin valores para question");
          break;
        }

        if (!grape.onConfirm) {
          console.log("Has creado un grape de tipo userConfirm sin valores para onConfirm");
          break;
        }

        util.getSetting("appDispatch")({
          type: "invocarConfirm",
          payload: {
            ...(this.isFunction(grape.question) ? grape.question(payload, state) : grape.question),
            alConfirmar: payloadConfirm =>
              dispatch({
                type: grape.onConfirm,
                payload: grape.plug
                  ? grape.plug({ ...payload, ...payloadConfirm }, state)
                  : { ...payload, ...payloadConfirm },
              }),
            alDenegar: payloadConfirm =>
              grape.onCancel &&
              dispatch({
                type: grape.onCancel,
                payload: grape.plug
                  ? grape.plug({ ...payload, ...payloadConfirm }, state)
                  : { ...payload, ...payloadConfirm },
              }),
          },
        });
        break;

      case "deleteFromDict": {
        if (!cumpleRequeridos(grape, ["dictPath", "keyPath"])) {
          break;
        }
        const key = util.getStateValue(grape.keyPath, payload);
        const dict = { ...util.getStateValue(grape.dictPath, state) };
        delete dict[key];

        return this.setStateKey(state, { path: grape.dictPath, value: dict });
      }

      case "deleteFromList": {
        if (!cumpleRequeridos(grape, ["listPath", "keyPath"])) {
          break;
        }
        const key = util.getStateValue(grape.keyPath, payload);
        const list = [...util.getStateValue(grape.listPath, state)].filter(e => e !== key);

        return this.setStateKey(state, { path: grape.listPath, value: list });
      }

      case "cleanKey":
        if (!cumpleRequeridos(grape, ["keyPath"])) {
          break;
        }

        return this.setStateKey(state, { path: grape.keyPath, value: null });
    }

    return state;
  }
}

function cumpleRequeridos(grape, requeridos) {
  return requeridos.reduce((acum, r) => {
    if (grape[r]) {
      return true;
    }
    console.log(`Has creado un grape de tipo ${grape.type} sin valores para ${r}`);

    return false;
  }, true);
}
