import { Field, Schema } from "quimera/lib";

export default parent => ({
  ...parent,
  nuevaEmpresa: Schema("ss_companies", "id").fields({
    nombre: Field.Text("nombre", "Nombre").required(),
    email: Field.Text("email", "Email").required(),
    pass: Field.Password("pass", "Contraseña").required(),
  }),
});
