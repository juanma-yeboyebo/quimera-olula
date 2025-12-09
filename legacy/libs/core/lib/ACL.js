import { getRules } from "../hooks/useManager";
import util from "../util";

const getAcl = group => {
  const acl = util.getUser()?.acl;

  if (group === "general") {
    return { access: acl?.global_access };
  }

  const groupAcl = acl?.groups?.[group];

  // const models = Object.entries(groupAcl.models).map((model) => ({ model: model[0], access: model[1].access, ...model[1].methods }))
  // return {
  //   access: groupAcl.access,
  //   ...models.reduce((accum, item) => ({ ...accum, [item.model]: item }), {})
  // }
  return groupAcl;
};
const isFunction = fn => fn && {}.toString.call(fn) === "[object Function]";

const check = (group, checkToken) => {
  if (Array.isArray(checkToken)) {
    return checkToken.every(token => check(group, token));
  }

  const acl = getAcl(group);

  const splitted = checkToken.split("/");
  const tokens = splitted.length === 1 ? checkToken.split(".") : splitted;
  const model = tokens[0];
  const verb = tokens.length > 2 ? tokens[1] : null;
  const action = tokens.length > 2 ? tokens[2] : tokens[1];

  const actionRule = acl?.models?.[model]?.methods?.[action];
  if (actionRule) {
    return true;
  }
  if (!(actionRule ?? true)) {
    return false;
  }

  if (verb) {
    const verbRule = acl?.models?.[model]?.methods?.[verb];
    if (verbRule) {
      return true;
    }
    if (!(verbRule ?? true)) {
      return false;
    }
  }

  const modelRule = acl?.models?.[model]?.access;
  if (modelRule) {
    return true;
  }
  if (!(modelRule ?? true)) {
    return false;
  }

  const groupRule = acl?.access;
  if (groupRule) {
    return true;
  }
  if (!(groupRule ?? true)) {
    return false;
  }

  const generalRule = getAcl("general")?.access;
  if (generalRule) {
    return true;
  }
  if (!(generalRule ?? true)) {
    return false;
  }

  return true;
};

const getRuleValue = (rule, group) => {
  return isFunction(rule) ? rule(checkTokens => check(group, checkTokens)) : rule;
};

const dynamicCan = action => {
  const superuser = util.getUser()?.superuser;
  if (superuser) {
    return true;
  }

  const rules = getRules();
  const group = util.getUser()?.group;

  const actionGroup = getRuleValue(rules?.[action], group);
  if (actionGroup) {
    return true;
  }
  if (!(actionGroup ?? true)) {
    return false;
  }

  // const globalGroup = getRuleValue(rules?.[group]?.access, group)
  // if (globalGroup) return true
  // if (!(globalGroup ?? true)) return false

  // const global = getRuleValue(rules?.access, 'general')
  // if (global) return true
  // if (!(global ?? true)) return false

  return true;
};

export default {
  // can: (action) => {
  //   const rules = getRules()
  //   const group = util.getUser()?.grupo
  //   return (rules?.access || ((rules?.[group]?.access && (rules?.[group]?.[action] ?? true)) || rules?.[group]?.[action])) ?? false
  // }
  can: dynamicCan,
};

// rules: {
//   access: (rules) => rules.global_access,
//   G: {
//     access: (rules) => rules.access,
//   },
//   agentes: {
//     access: (rules) => rules.access,

//     'Home:visit': true,
//     'PedidosAgente:visit': (rules) => rules.pedidoscli.get ?? rules.pedidoscli.access,
//     'PedidosAgente:botones-creacion': (rules) => rules.pedidoscli.crearpedidoespecial ?? (rules.pedidoscli.post ?? rules.pedidoscli.access)
//   },
// }

// o

// dRules: {
//   access: (rules) => rules.global_access,
//   'Home:visit': true,
//   'PedidosAgente:visit': (rules) => rules.pedidoscli.get ?? rules.pedidoscli.access,
//   'PedidosAgente:botones-creacion': (rules) => rules.pedidoscli.crearpedidoespecial ?? (rules.pedidoscli.post ?? rules.pedidoscli.access)
// }
// y cambiar la logica actual
