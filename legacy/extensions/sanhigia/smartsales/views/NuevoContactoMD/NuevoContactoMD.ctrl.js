import { getSchemas } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./NuevoContactoMD.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onContactoEmailChanged: [
      {
        type: "setStateKey",
        plug: ({ value }, { contacto }) => ({
          path: "contacto.buffer",
          value: { ...contacto.buffer, email: value, codContacto: null },
        }),
      },
      {
        type: "setStateKey",
        plug: () => ({ path: "estadoEmail", value: "comprobando" }),
      },
    ],
    setEmailInvalido: [
      {
        type: "setStateKey",
        plug: () => ({ path: "estadoEmail", value: "invalido" }),
      },
    ],
    checkEmail: [
      {
        type: "get",
        schema: getSchemas().contacto,
        filter: ({ value }) => ["email", "eq", value],
        success: "onEmailCheckedSucceded",
      },
    ],
    onEmailCheckedSucceded: [
      {
        condition: ({ response }) => response?.data?.length > 0,
        type: "setStateKey",
        plug: () => ({ path: "estadoEmail", value: "validoYaExisite" }),
      },
      {
        condition: ({ response }) => response?.data?.length > 0,
        type: "setStateKey",
        plug: ({ response }, { contacto }) => ({
          path: "contacto.buffer",
          value: { ...contacto.buffer, codContacto: response.data[0].codContacto },
        }),
      },
      {
        condition: ({ response }) => response?.data?.length === 0,
        type: "setStateKey",
        plug: () => ({ path: "estadoEmail", value: "validoNoExisite" }),
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
