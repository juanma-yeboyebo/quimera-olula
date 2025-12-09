import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./PresupuestoCli.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});

export const bunch = parent => ({
  ...parent,
  ...shortcutsBunch(data.shortcuts),
  seteaStatusCreatingLine: [
    {
      type: "function",
      function: ({ referencia }, { historico }) => {
        const historicoAux = historico;
        historicoAux.dict[referencia]["_status"] = "creating_line";

        return { historico: historicoAux };
      },
      success: [
        {
          type: "setStateKey",
          plug: ({ response }) => ({ path: "historico", value: response.historico }),
        },
      ],
    },
  ],
  ...applyBunch(data.bunch, parent),
});
