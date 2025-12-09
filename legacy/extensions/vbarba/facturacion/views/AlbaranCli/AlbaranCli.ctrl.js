import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";
import { util } from "quimera";
import data from "./AlbaranCli.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  puesto: util.getUser()?.user,
  logic: {
    ...parent.logic,
  },
});



export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
