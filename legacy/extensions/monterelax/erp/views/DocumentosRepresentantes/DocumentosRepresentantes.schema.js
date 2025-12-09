import { Field, Schema } from "quimera/lib";

export default {
  documentos: Schema("gd_documentos", "iddocumento")
    // .api('gd_documentos')
    .fields({
      id: Field.Text("iddocumento", "Id"),
      tipoobjeto: Field.Text("tipoobjeto", "Tipo objeto"),
      claveobjeto: Field.Text("claveobjeto", "Clave objeto"),
    })
    .extract(),
};
