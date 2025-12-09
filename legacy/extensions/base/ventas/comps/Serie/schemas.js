import { Field, Schema } from "quimera/lib";

export default {
  agentes: Schema("agentes", "codagente")
    .fields({
      codAgente: Field.Text("codagente", "Cód. Agente"),
      nombre: Field.Text("nombreap", "Nombre"),
    })
    .extract(),
};
