import { DetailAPI, DetailCtrl, MasterAPI, MasterCtrl } from "../lib";

function defaultFunc(args, Obj, oldKey, newKey) {
  console.error(
    `Quimera deprecated import: core/base for "Templates.${oldKey}". Please, use core/lib "${newKey}" instead`,
  );

  return Obj(...args);
}

export default {
  masterCtrl: (...args) => defaultFunc(args, MasterCtrl, "masterCtrl", "MasterCtrl"),
  detailCtrl: (...args) => defaultFunc(args, DetailCtrl, "detailCtrl", "DetailCtrl"),
  masterApi: (...args) => defaultFunc(args, MasterAPI, "masterApi", "MasterAPI"),
  detailApi: (...args) => defaultFunc(args, DetailAPI, "detailApi", "DetailAPI"),
};
