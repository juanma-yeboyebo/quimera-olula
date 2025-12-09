import { API } from "../lib";
import util from "../util";
import { navigate } from "./router";
import { interpreter } from "./staticApi";

export default class BaseApi {
  controller = null;

  constructor(c) {
    this.controller = c;
  }

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

  getState() {
    return this.controller.state;
  }

  patch(
    schema,
    dispatch,
    state,
    { key, changes, action = null, files = null, success = null, error = null },
  ) {
    let api = this.newAPI(schema.name)
      .api(schema.api)
      .patch(key, action)
      .setKeys(schema.dump(changes, { partial: true }));

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

  // console.log('Params?', grape.params)
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
    console.log("ACTION = ", pk);
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

  eat(type, payload, dispatch) {
    console.log("Eating ", type, payload);
    if (!(type in this.bunch)) {
      if (type.startsWith("on") && type.endsWith("Changed")) {
        this.eatGrape(
          {
            type: "setStateKey",
            plug: ({ field, value }) => ({ path: field, value }),
          },
          payload || {},
          dispatch,
        );
      }

      return;
    }
    const actions = this.bunch[type];
    actions.map(a => this.eatGrape(a, payload || {}, dispatch));
  }

  eatGrape(grape, payload, dispatch) {
    const state = this.getState();

    grape = interpreter(grape, payload, state);
    if (Array.isArray(grape)) {
      grape.map(g => this.eatGrape(g, payload, dispatch));

      return;
    }

    console.log("Grape tipo:", grape.type, "grape:", grape, "payload", payload);

    if (grape.log) {
      console.log(grape.log(payload, state));
    }

    if (grape.condition && !grape.condition(payload, state)) {
      console.log("No se cumple la condición de grape.condition");

      return;
    }

    if (grape.type === "get") {
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
          console.log("Success get", response);
          Array.isArray(grape.success)
            ? grape.success.map(a => this.eatGrape(a, { ...payload, response }, dispatch))
            : dispatch({
                type: grape.success,
                payload: { ...payload, response },
              });
        },
        error: response => {
          console.log("Error get", response);
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
    }

    if (grape.type === "patch") {
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
            console.log("Success patch", response);
            Array.isArray(grape.success)
              ? grape.success.map(a => this.eatGrape(a, { ...payload, response }, dispatch))
              : dispatch({
                  type: grape.success,
                  payload: { ...payload, response },
                });
          },
          error: response => {
            console.log("Error patch", response);
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
    }

    if (grape.type === "post") {
      this.post(
        this.isFunction(grape.schema) ? grape.schema(payload, state) : grape.schema,
        dispatch,
        state,
        {
          data: grape.data(payload, state),
          action: grape.action || null,
          success: response => {
            console.log("Success post", response);
            Array.isArray(grape.success)
              ? grape.success.map(a => this.eatGrape(a, { ...payload, response }, dispatch))
              : dispatch({
                  type: grape.success,
                  payload: { ...payload, response },
                });
          },
          error: response => {
            console.log("Error post", response);
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
    }

    if (grape.type === "delete") {
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
            console.log("Success delete", response);
            Array.isArray(grape.success)
              ? grape.success.map(a => this.eatGrape(a, { ...payload, response }, dispatch))
              : dispatch({
                  type: grape.success,
                  payload: { ...payload, response },
                });
          },
          error: response => {
            console.log("Error delete", response);
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
    }

    if (grape.type === "download") {
      // const sch = this.isFunction(grape.schema) ? grape.schema(payload, state) : grape.schema
      // let api = API(sch.name)
      //   .get(grape.pk ? grape.pk(payload, state): '-static-', grape.action)

      // console.log('Params?', grape.params)
      // if (grape.params) {
      //   api = api.setKeys(grape.params(payload, state))
      // }
      // if (grape.filter) {
      //   api = api.filter(grape.filter(payload, state))
      // }
      // (schema, dispatch, { params = null, filter = null, filename=null, success = null, error = null })
      this.download(
        this.isFunction(grape.schema) ? grape.schema(payload, state) : grape.schema,
        dispatch,
        {
          action: grape.action || null,
          params: grape.params ? grape.params(payload, state) : {},
          filter: grape.filter ? grape.filter(payload, state) : null,
          filename: grape.fileName ? grape.fileName(payload, state) : "file",
          success: response => {
            console.log("Success download", response);
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
            console.log("Error download", response);
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
      // api.download('', grape.fileName(payload, state), dispatch)
    }

    if (grape.type === "dispatch") {
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
    }

    if (grape.type === "appDispatch") {
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
    }

    if (grape.type === "setPageName") {
      util.appDispatch({
        type: "setNombrePaginaActual",
        payload: grape.plug ? grape.plug(payload, state) : payload.response,
      });
    }

    if (grape.type === "showMessage") {
      util.appDispatch({
        type: "mostrarMensaje",
        payload: grape.plug ? grape.plug(payload, state) : payload.response,
      });
    }

    if (grape.type === "setStateKey") {
      this.controller.setStateKey(
        state,
        grape.plug ? grape.plug(payload, state) : payload.response,
      );
    }

    if (grape.type === "setStateKeys") {
      this.controller.setStateKeys(
        state,
        grape.plug ? grape.plug(payload, state) : payload.response,
      );
    }

    if (grape.type === "function") {
      if (!grape.function) {
        console.log("Has creado un grape de tipo function sin valores para function");

        return;
      }
      const response = grape.plug
        ? grape.function(grape.plug(payload, state))
        : grape.function(payload, state);
      grape.success && grape.success.map(a => this.eatGrape(a, { ...payload, response }, dispatch));
    }

    if (grape.type === "navigate") {
      if (!grape.url) {
        console.log("Has creado un grape de tipo navigate sin valores para url");

        return;
      }
      const url = grape.url(payload, state);
      if (url.startsWith("/")) {
        navigate(url);
      } else {
        window.location = url;
      }
    }

    if (grape.type === "redirect") {
      if (!grape.url) {
        console.log("Has creado un grape de tipo navigate sin valores para url");

        return;
      }
      navigate(grape.url(payload, state));
    }

    if (grape.type === "newtab") {
      if (!grape.url) {
        console.log("Has creado un grape de tipo newtab sin valores para url");

        return;
      }
      window.open(grape.url(payload, state), "_blank");
    }

    if (grape.type === "regrape" || grape.type === "grape") {
      if (grape.type === "regrape") {
        console.error('Quimera deprecated grape type "regrape". Use grape instead');
      }
      if (!grape.grape && !grape.name) {
        console.log("Has creado un grape de tipo grape sin valores para name");

        return;
      }
      if (grape.grape) {
        console.error(
          'Quimera deprecated grape attribute "grape" for type "grape". Use "name" instead',
        );
        grape.name = grape.grape;
      }
      this.eat(
        grape.name,
        grape.plug ? { ...payload, ...grape.plug(payload, state) } : payload,
        dispatch,
      );
    }

    if (grape.type === "action") {
      if (!grape.action) {
        console.log("Has creado un grape de tipo action sin valores para action");

        return;
      }
      grape.action && grape.action.map(a => this.eatGrape(a, { ...payload }, dispatch));
    }

    if (grape.type === "print") {
      if (!grape.printerUrl) {
        console.log("Has creado un grape de tipo print sin valores para printerUrl");

        return;
      }
      if (!grape.printerAlias) {
        console.log("Has creado un grape de tipo print sin valores para printerAlias");

        return;
      }
      if (!grape.reportAlias) {
        console.log("Has creado un grape de tipo print sin valores para reportAlias");

        return;
      }
      if (!grape.data) {
        console.log("Has creado un grape de tipo print sin valores para data");

        return;
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
    }

    if (grape.type === "userConfirm") {
      if (!grape.question) {
        console.log("Has creado un grape de tipo userConfirm sin valores para question");

        return;
      }

      if (!grape.onConfirm) {
        console.log("Has creado un grape de tipo userConfirm sin valores para onConfirm");

        return;
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
    }

    if (grape.type === "deleteFromDict") {
      if (!cumpleRequeridos(grape, ["dictPath", "keyPath"])) {
        return false;
      }

      const key = util.getStateValue(grape.keyPath, payload);
      const dict = { ...util.getStateValue(grape.dictPath, state) };
      delete dict[key];

      this.controller.setStateKey(state, { path: grape.dictPath, value: dict });
    }

    if (grape.type === "deleteFromList") {
      if (!cumpleRequeridos(grape, ["listPath", "keyPath"])) {
        return false;
      }
      const key = util.getStateValue(grape.keyPath, payload);
      const list = [...util.getStateValue(grape.listPath, state)].filter(e => e !== key);

      this.controller.setStateKey(state, { path: grape.listPath, value: list });
    }

    if (grape.type === "cleanKey") {
      if (!cumpleRequeridos(grape, ["keyPath"])) {
        return false;
      }
      this.controller.setStateKey(state, { path: grape.keyPath, value: null });
    }
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
