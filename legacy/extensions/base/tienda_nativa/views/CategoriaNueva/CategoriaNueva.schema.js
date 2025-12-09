import { Field, Schema } from "quimera/lib";
// import TypeOptions from './TypeOptions'

export default {
  categoria: Schema("to_categorias", "idcategoria")
    .fields({
      idCatPadre: Field.Int("idcatpadre", "Id. Categoria padre"),
      urlkey: Field.Text("urlkey", "URL key"),
    })
    .extract(),
};
