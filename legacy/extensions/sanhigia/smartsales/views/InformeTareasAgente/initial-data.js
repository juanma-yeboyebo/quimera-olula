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
  estados: [
    { key: true, value: "Completada" },
    { key: false, value: "No completada" },
  ],
};

export default initialData;
