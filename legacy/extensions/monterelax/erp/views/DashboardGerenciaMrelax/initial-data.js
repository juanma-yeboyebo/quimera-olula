import { util } from "quimera";

const initialData = {
  intervalos: util.intervalosAOpciones([
    "thisWeek",
    "thisMonth",
    "thisYear",
    "preWeek"
  ]),
};

export default initialData;
