import { Field, Schema } from "quimera/lib";

export default {
  colaCosido: Schema("mx_colacosido", "idunidad")
    .fields({
      idunidad: Field.Text("idunidad", "Id. Unidad"),
      modelo: Field.Text("modelo", "Modelo"),
      idtela: Field.Text("idtela", "Id. Tela"),
      fechasalida: Field.Date("fechasalida", "Fecha salida")
    })
    .filter(() => ["1", "eq", "1"])
    .limit(1000)
    .order(() => ({ field: "fechasalida", direction: "ASC" }))
    .extract(),
};
