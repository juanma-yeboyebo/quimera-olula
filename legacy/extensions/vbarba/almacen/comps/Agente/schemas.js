import { Field, Schema } from "quimera/lib";

export default {
  agentes: Schema("agentes", "codagente")
    .fields({
      codAgente: Field.Text("codagente", "Cód. agente"),
      nombreap: Field.Text("nombreap", "Apellidos y nombre"),
    })
    .extract(),
};
