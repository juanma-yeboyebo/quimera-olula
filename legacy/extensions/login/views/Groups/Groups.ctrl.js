import { ModelAPI, ModelCtrl, QArray } from "quimera/lib";

import schemas from "../../static/schemas";

export const state = parent => ({
  ...parent,
  groups: ModelCtrl(schemas.group),
  groupsBuffer: {},
  rules: [],
  groupedRules: {},
  rulesValues: [],
  filtroReglas: "",
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "groups",
    id: "id",
    schema: schemas.group,
    url: "/groups",
  }),
  onInit: [
    {
      type: "grape",
      name: "getGroups",
    },
    {
      type: "grape",
      name: "getReglas",
    },
  ],
  onGetGroupsSucceded: [
    {
      type: "grape",
      name: "getValoresReglas",
    },
    {
      type: "grape",
      name: "cargaBufferGroup",
    },
  ],
  onAtrasClicked: [
    {
      type: "navigate",
      url: () => "/groups",
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "groups.current", value: null }),
    },
  ],
  onIdGroupsChanged: [
    {
      type: "grape",
      name: "getValoresReglas",
    },
    {
      type: "grape",
      name: "cargaBufferGroup",
    },
  ],
  getReglas: [
    {
      type: "get",
      schema: schemas.rule,
      success: "onReglasRecieved",
    },
  ],
  onReglasRecieved: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({ path: "rules", value: response.data }),
    },
    {
      type: "grape",
      name: "setGroupedRules",
    },
  ],
  getValoresReglas: [
    {
      condition: (_payload, { groups }) => groups.current,
      type: "get",
      schema: schemas.rulevalue,
      filter: (_, { groups }) => ["idgroup", "eq", groups.current],
      success: "getValoresReglasSucceded",
    },
  ],
  getValoresReglasSucceded: [
    {
      type: "setStateKey",
      plug: ({ response }) => ({ path: "rulesValues", value: response.data }),
    },
    {
      type: "grape",
      name: "setGroupedRules",
    },
  ],
  cargaBufferGroup: [
    {
      condition: (_payload, { groups }) => groups.current,
      type: "setStateKey",
      plug: (_payload, { groups }) => ({
        path: "groupsBuffer",
        value: { ...groups.dict[groups.current] },
      }),
    },
  ],
  onSeccionConfirmada: [
    {
      type: "setStateKey",
      plug: ({ fields }, { groups, groupsBuffer }) => ({
        path: "groups.dict",
        value: {
          ...groups.dict,
          [groups.current]: fields.reduce(
            (accum, item) => ({ ...accum, [item]: groupsBuffer[item] }),
            groups.dict[groups.current],
          ),
        },
      }),
    },
    {
      condition: ({ onSuccess }) => !!onSuccess,
      type: "function",
      function: ({ onSuccess }) => onSuccess && onSuccess(),
    },
    {
      condition: (_, { groups }) => !!groups.current && groups.current !== "nuevo",
      type: "patch",
      schema: schemas.group,
      id: (_, { groups }) => groups.current,
      data: ({ fields }, { groups }) =>
        fields.reduce(
          (accum, key) => ({
            ...accum,
            [key]: groups.dict[groups.current][key],
          }),
          {},
        ),
      success: "onGroupUpdated",
    },
  ],
  onGroupUpdated: [
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Grupo actualizado correctamente",
        tipoMensaje: "success",
      }),
    },
  ],
  onSeccionCancelada: [
    {
      type: "setStateKey",
      plug: ({ fields }, { groups, groupsBuffer }) => ({
        path: "groupsBuffer",
        value: {
          ...groupsBuffer,
          ...fields.reduce(
            (accum, item) => ({
              ...accum,
              [item]: groups.dict[groups.current][item],
            }),
            groupsBuffer,
          ),
        },
      }),
    },
  ],
  onDescripcionSeccionConfirmada: [
    {
      type: "grape",
      name: "onSeccionConfirmada",
      plug: payload => ({ ...payload, fields: ["id", "descripcion"] }),
    },
  ],
  onDescripcionSeccionCancelada: [
    {
      type: "grape",
      name: "onSeccionCancelada",
      plug: () => ({ fields: ["id", "descripcion"] }),
    },
  ],
  onEliminarGrupoSeccionConfirmada: [
    {
      type: "delete",
      schema: schemas.group,
      id: (_, { groups }) => groups.current,
      success: "onGroupDeleted",
    },
  ],
  onGroupDeleted: [
    {
      type: "grape",
      name: "onAtrasClicked",
    },
    {
      type: "grape",
      name: "getGroups",
    },
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Grupo eliminado correctamente",
        tipoMensaje: "success",
      }),
    },
  ],
  onNuevoGrupoClicked: [
    {
      type: "grape",
      name: "onGroupsClicked",
      plug: _p => ({ item: { id: "nuevo" } }),
    },
  ],
  onGuardarNuevoGrupoClicked: [
    {
      type: "post",
      schema: schemas.group,
      data: (_, { groupsBuffer }) => groupsBuffer,
      success: "onGroupSaved",
    },
  ],
  onGroupSaved: [
    {
      type: "showMessage",
      plug: (_, { groupsBuffer }) => ({
        mensaje: `Grupo ${groupsBuffer.id} creado correctamente`,
        tipoMensaje: "success",
      }),
    },
    {
      type: "grape",
      name: "getGroups",
    },
    {
      type: "navigate",
      url: (_, { groupsBuffer }) => `/groups/${groupsBuffer.id}`,
    },
  ],
  onFiltroReglasChanged: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "filtroReglas", value }),
    },
    {
      type: "grape",
      name: "setGroupedRules",
    },
  ],
  setGroupedRules: [
    {
      log: (_, { groups, filtroReglas, rules, rulesValues }) => ["rules:", rules],
      type: "setStateKey",
      plug: (_, { groups, filtroReglas, rules, rulesValues }) => ({
        path: "groupedRules",
        value: QArray.groupBy(
          rules
            ?.filter(
              rule =>
                rule?.idRegla?.toLowerCase().includes(filtroReglas.toLowerCase()) ||
                rule?.descripcion?.toLowerCase().includes(filtroReglas.toLowerCase()) ||
                rule?.grupo?.toLowerCase().includes(filtroReglas.toLowerCase()) ||
                rule?.grupo === rule?.idRegla ||
                rule?.grupo === "general",
            )
            ?.map(rule => ({
              ...rule,
              valor: rulesValues.find(
                vr => vr.idGroup === groups.current && vr.idRegla === rule.idRegla,
              )?.valor,
            })) ?? [],
          "grupo",
        ),
      }),
    },
  ],
  onPermissionChanged: [
    {
      condition: (payload, { groups, rulesValues }) =>
        !rulesValues.find(rule => rule.idRegla === payload.rule && rule.idGroup === groups.current),
      type: "post",
      schema: schemas.rulevalue,
      data: (payload, { groups }) => ({
        idRegla: payload.rule,
        idGroup: groups.current,
        valor: payload.value,
      }),
      success: "onNewPermission",
    },
    {
      condition: (payload, { groups, rulesValues }) =>
        !!rulesValues.find(
          rule => rule.idRegla === payload.rule && rule.idGroup === groups.current,
        ),
      type: "patch",
      schema: schemas.rulevalue,
      id: (payload, { groups, rulesValues }) =>
        rulesValues.find(rule => rule.idRegla === payload.rule && rule.idGroup === groups.current)
          .idPermission,
      data: (payload, { groups, rulesValues }) => ({
        idPermission: rulesValues.find(
          rule => rule.idRegla === payload.rule && rule.idGroup === groups.current,
        ).idPermission,
        idRegla: payload.rule,
        idGroup: groups.current,
        valor: payload.value,
      }),
      success: "onPermissionUpdated",
    },
  ],
  onNewPermission: [
    {
      type: "grape",
      name: "getValoresReglas",
    },
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Permiso actualizado",
        tipoMensaje: "success",
      }),
    },
  ],
  onPermissionUpdated: [
    {
      type: "grape",
      name: "getValoresReglas",
    },
    {
      type: "showMessage",
      plug: () => ({
        mensaje: "Permiso actualizado",
        tipoMensaje: "success",
      }),
    },
  ],
});
