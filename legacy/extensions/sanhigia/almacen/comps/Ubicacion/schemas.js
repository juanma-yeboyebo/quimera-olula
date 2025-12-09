import { Field, Schema } from "quimera/lib";

export default {
  ubicacion: Schema("sh_ubicaciones", "codubicacion")
    .fields({
      codUbicacion: Field.Text("codubicacion", "Cód. Ubicación"),
    })
    .extract(),
};
