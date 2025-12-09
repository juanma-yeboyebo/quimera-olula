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
    { key: "-", value: "PENDIENTE" },
    { key: "Ganado", value: "GANADO" },
    { key: "Perdido", value: "PERDIDO" },
  ],
};

export default initialData;
