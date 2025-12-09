import { util } from "quimera";

const initialData = {
  intervalos: util.intervalosAOpciones([
    "preWeek",
    "lastWeek",
    "thisWeek",
    "lastMonth",
    "thisMonth",
    "lastYear",
    "thisYear",
  ]),
};

export default initialData;
