import { Field, Schema } from "quimera/lib";

export default parent => ({
  ...parent,
  ordenesCarga: Schema("mx_ordenescarga", "idorden")
    .fields({
      idorden: Field.Text("idorden", "Orden"),
      fecha: Field.Date("fecha", "Fecha"),
      codruta: Field.Text("codruta", "Ruta"),
      estado: Field.Text("estado", "Estado"),
      codcamion: Field.Text("codcamion", "Camion"),
      partidas: Field.Text("partidas", "Partidas")
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "idorden", direction: "ASC" }))
    .extract()
});
