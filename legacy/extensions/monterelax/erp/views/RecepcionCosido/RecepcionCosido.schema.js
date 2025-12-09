import { Field, Schema } from "quimera/lib";

export default {
  recepcionCosido: Schema("mx_colacosido", "idunidad")
    .fields({
      idunidad: Field.Text("idunidad", "Id. Unidad"),
      modelo: Field.Text("modelo", "Modelo"),
      idtela: Field.Text("idtela", "Id. Tela"),
      cosedor: Field.Text("cosedor", "Cosedor"),
      fechasalida: Field.Date("fechasalida", "Fecha salida"),
      cosido: Field.Text("cosido", "Cosido"),
    })
    .filter(() => ["1", "eq", "1"])
    .limit(1000)
    .order(() => ({ field: "fechasalida", direction: "ASC" }))
    .extract(),
};
