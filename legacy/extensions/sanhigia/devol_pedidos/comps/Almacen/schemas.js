import { Field, Schema } from "quimera/lib";

export default {
  almacen: Schema("almacenes", "codalmacen")
    .fields({
      codAlmacen: Field.Text("codalmacen", "Cód. Almacén"),
      nombre: Field.Text("nombre", "Nombre"),
    })
    .extract(),
};
