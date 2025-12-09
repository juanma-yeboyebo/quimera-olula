import { util } from "quimera";
import { applyBunch, InnerDB, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./Welcome.ctrl.yaml";

const UserDb = InnerDB.table("user_data");

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  util,
  UserDb,
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
