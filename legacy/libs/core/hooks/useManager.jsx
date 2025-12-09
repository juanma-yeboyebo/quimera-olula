import { translations as compTranslations } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";

import Quimera from "..";
import { BaseController } from "../base";
// import { mergeDeep } from '../util'
import util from "../util";

const mgr = {
  views: {},
  subviews: {},
  project: null,
};

async function getDependencies(deps, dict) {
  const cleanDeps = deps.filter(otherDep => !(otherDep.path in dict));
  if (cleanDeps.length === 0) {
    return;
  }

  // const depModules = await Promise.all(cleanDeps.map(m => import(`../../${m}`)))
  const depModules = cleanDeps;
  for (let i = 0; i < cleanDeps.length; i++) {
    const d = depModules[i];
    const depId = cleanDeps[i].path;
    d.id = depId;
    // eslint-disable-next-line require-atomic-updates
    dict[depId] = d;
    if ("dependencies" in d) {
      await getDependencies(d.dependencies, dict);
    }
  }
}

function getOrderedDependencies(deps, dict, alreadyIn) {
  const orderedDeps = [];
  const filteredDeps = deps.filter(otherDep => !(otherDep.path in alreadyIn));
  for (const filteredDep of filteredDeps) {
    const dep = dict[filteredDep.path];
    alreadyIn[dep.id] = true;
    if ("dependencies" in dep) {
      orderedDeps.push(...getOrderedDependencies(dep.dependencies, dict, alreadyIn));
    }
    orderedDeps.push(dep);
  }

  return orderedDeps;
}

export async function loadProject(project) {
  const p = project;
  const depsDict = {};
  await getDependencies(p.dependencies, depsDict);
  const depObjects = getOrderedDependencies(p.dependencies, depsDict, {});

  const globalStyles = depObjects.map(m => m.style);

  mgr.project = {
    views: depObjects.map(
      m =>
        async function (name) {
          return name in m.views ? m.views[name] : null;
        },
    ),
    subviews: depObjects.map(
      m =>
        async function (name) {
          return name in m.subviews ? m.subviews[name] : null;
        },
    ),
    globalStyles: globalStyles
      .filter(style => !!style)
      .reduce(
        (accumulated, current) => current.default(accumulated),
        () => ({}),
      ),
    dependencies: depObjects,
    routes: depObjects.map(m => m.routes),
    rules: depObjects.map(m => m.rules),
    schemas: joinSchemas(depObjects),
    translations: depObjects.map(m => m?.translations),
    theme: p.theme,
    languages: p.languages,
    menus: {
      app: depObjects.map(m => m?.menus?.app),
      user: depObjects.map(m => m?.menus?.user),
    },
  };
}

function setView(name, view) {
  mgr.views[name] = view;
}

export function getView(name) {
  if (!(name in mgr.views)) {
    return [[{}, {}], {}, [], {}, {}];
  }

  // const [initialState, ControllerClass, ApiClass, ui, style, aggregatedBunch] = mgr.views[name]
  const [initialState, ControllerClass, ui, style, aggregatedBunch] = mgr.views[name];
  const myInitialState = { ...initialState };
  const controller = new ControllerClass(myInitialState);
  const ctrl = [getReducer(controller), myInitialState];
  // const api = new ApiClass(controller)
  // !!Object.keys({ ...aggregatedBunch }).length && (api.bunch = aggregatedBunch)
  !!Object.keys({ ...aggregatedBunch }).length && (controller.bunch = aggregatedBunch);
  // const apiMiddleware = getApiMiddleware(api)

  // return [ctrl, apiMiddleware, ui, style]
  return [ctrl, null, ui, style];
}

function setSubView(name, subview) {
  mgr.subviews[name] = subview;
}

const CreateView = ({ id, ...props }) => <Quimera.View id={id} {...props} />;

const cachedViews = {};
export function buildView(id, props) {
  if (!(id in cachedViews)) {
    cachedViews[id] = CreateView;
  }
  const View = cachedViews[id];

  return <View id={id} {...props} />;
}

const getReducer = controller => (state, action) => {
  const fn = controller[action.type];
  if (controller.bunch) {
    return controller.eat(state, action.type, action.payload, action.payload.dispatch);
  }
  if (fn) {
    return controller[action.type](state, action.payload);
    // Pasado a baseApi->eat()
    // } else if (action.type.startsWith('on') && action.type.endsWith('Changed')) {
    //   const update = (ctrlState, keys) => {
    //     if (!keys.length) {
    //       return action.payload.value
    //     }
    //     const [key, ...rest] = keys
    //     return {
    //       ...ctrlState,
    //       [key]: update(ctrlState[key], rest)
    //     }
    //   }
    //   return controller.setState(update(controller.state, action.payload.field.split('.')))
    // } else if (ctrl.bunch) {
    //   return ctrl.eat(state, action.type, action.payload, action.payload.dispatch)
  }
  console.log(action.type, " no encontrada, devolviendo estado de memoria ", controller.state);

  return controller.state;
};

// const getApiMiddleware = (api) => (action, dispatch) => {
//   var fn = api[action.type]
//   if (fn) {
//     api[action.type](action.payload || {}, dispatch)
//   } else {
//     if (api.bunch) {
//       api.eat(action.type, action.payload, dispatch)
//     }
//   }
// }

export async function loadView(name) {
  if (name in mgr.views) {
    return;
  }

  const viewList = await Promise.all(mgr.project.views.map(m => m(name)));

  const ctrls = viewList.filter(m => m != null && m.ctrl != null).map(m => m.ctrl);
  const states = viewList.filter(m => m != null && m.state != null).map(m => m.state);
  // const apis = viewList.filter(m => m != null && m.api != null).map(m => m.api)
  const uis = viewList.filter(m => m != null && m.ui != null).map(m => m.ui);
  const styles = viewList.filter(m => m != null && m.style != null).map(m => m.style);
  const bunches = viewList.filter(m => m != null && m.bunch != null).map(m => m.bunch);

  const initialState = states.reduce(
    (fun, item) => item(fun),
    () => ({}),
  );
  const ControllerClass = ctrls.reduce((fun, item) => item(fun), BaseController);

  // const ApiClass = apis.reduce((fun, item) => item(fun), BaseApi)
  const aggregatedBunch = bunches.reduce(
    (fun, item) => item(fun),
    () => ({}),
  );
  const ui = uis.reverse();
  const style = makeStyles(
    styles.reduce(
      (fun, item) => item(fun),
      theme => ({ ...mgr.project.globalStyles(theme) }),
    ),
  );

  // setView(name, [initialState, ControllerClass, ApiClass, ui, style, aggregatedBunch])
  setView(name, [initialState, ControllerClass, ui, style, aggregatedBunch]);
}

export async function loadSubView(name) {
  if (name in mgr.subviews) {
    return;
  }

  const subviewList = await Promise.all(mgr.project.subviews.map(m => m(name)));

  const uis = subviewList.filter(m => m != null && m.ui != null).map(m => m.ui);
  const styles = subviewList.filter(m => m != null && m.style != null).map(m => m.style);
  const ui = uis.reverse();
  const style = makeStyles(
    styles.reduce(
      (fun, item) => item(fun),
      theme => ({ ...mgr.project.globalStyles(theme) }),
    ),
  );

  setSubView(name, [null, null, ui, style]);
}

export function getRoutes() {
  return mgr.project.routes.reduce((obj, route) => {
    return { ...obj, ...route };
  }, {});
}

export function getTranslations() {
  return mgr.project?.translations?.reduce((obj, translation = {}) => {
    return util.mergeDeep(obj, translation);
  }, compTranslations);
}

export function joinSchemas(depObjects) {
  const combinedSchemas = depObjects
    .map(m => m.schemas)
    .filter(Boolean)
    .reduce((obj, schema) => schema(obj), {});

  return Object.keys(combinedSchemas)
    .map(key => {
      const obj = combinedSchemas[key]._runner
        ? combinedSchemas[key].extract(key)
        : combinedSchemas[key];

      return { [key]: obj };
    })
    .reduce((accum, item) => ({ ...accum, ...item }), {});
}

export function getSchemas() {
  return mgr.project.schemas;
}

export function getRules() {
  return mgr.project.rules.reduce(
    (obj, rule) => {
      return { ...obj, ...rule };
    },
    { access: true },
  );
}

export function getMenus() {
  return {
    app: mgr.project.menus.app
      .filter(m => m != null)
      .reduce(
        (accum, menu) => menu(accum),
        () => ({}),
      ),
    user: mgr.project.menus.user
      .filter(m => m != null)
      .reduce(
        (accum, menu) => menu(accum),
        () => ({}),
      ),
  };
}

export function getTheme() {
  return mgr.project.theme;
}

export function getMgr() {
  return mgr;
}

export function getLanguages() {
  return mgr.project.languages;
}

export function useSubView(name) {
  if (!(name in mgr.subviews)) {
    return [[{}, {}], {}, [], {}];
  }

  return mgr.subviews[name];
}

export function useView(name) {
  return getView(name);
}

export function viewLoaded(name) {
  return name in mgr.views;
}
