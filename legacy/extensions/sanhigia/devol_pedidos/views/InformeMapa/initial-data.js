import { util } from "quimera";

const initialData = {
  intervalos: util.intervalosAOpciones([
    "today",
    "untilToday",
    "thisWeek",
    "thisMonth",
    "thisYear",
    "preYear",
  ]),
};

export default initialData;
