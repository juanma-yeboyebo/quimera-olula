import { Field, Schema } from "quimera/lib";

export default {
  reparaciones: Schema("misreparaciones", "idreparacion")
    .fields({
      idReparacion: Field.Text("idreparacion", "Id").required(),
      estado: Field.Text("estado", "Estado").required(),
      fecha: Field.Date("fecha", "Fecha").required(),
      referencia: Field.Text("referencia", "Referencia"),
      descripcion: Field.Text("descripcion", "Descripcion"),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "fecha", direction: "DESC" }))
    .limit(1000)
    .extract(),
};
