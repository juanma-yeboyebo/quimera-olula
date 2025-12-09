import { Field, Schema } from "quimera/lib";

export default {
  agentes: Schema("familias", "codfamilia")
    .fields({
      codFamilia: Field.Text("codfamilia", "Cód. Familia"),
      descripcion: Field.Text("descripcion", "Descripcion"),
    })
    .extract(),
};
