import { Field, Schema } from "quimera/lib";

export default {
  login: Schema("login", "idusuario")
    .fields({
      email: Field.Text("username", "Correo").required(),
      password: Field.Text("password", "Contraseña").required(),
    })
    .filter(() => ["1", "eq", "1"])
    .extract(),
  whoami: Schema("user", "idusuario")
    .fields({
      idusuario: Field.Text("idusuario", "ID Usuario").required(),
    })
    .filter(() => ["1", "eq", "1"])
    .extract(),
};
