import { util } from "quimera";
import { Field, Schema } from "quimera/lib";

export default parent => ({
  ...parent,
  user: Schema("flusers", "iduser").fields({
    id: Field.Text("idusuario", "Identificador").required(),
    nombre: Field.Text("nombre", "Nombre").required(),
    email: Field.Text("email", "E-mail").required(),
    password: Field.Password("password", "Contraseña").required().load(false),
    idgroup: Field.Text("idgroup", "Grupo").required(),
    superusuario: Field.Bool("superusuario", "Superusuario").default(false),
  }),
  login: Schema("login", "idusuario")
    .fields({
      email: Field.Text("username", "E-mail").required(),
      password: Field.Text("password", "Contraseña").required(),
      // clientLogin: Field.Bool("clientLogin", "Login sobre clientes (no usuarios)").default(
      //   util.getEnvironment()?.clientLogin,
      // ),
      loginType: Field.Bool("loginType", "Login sobre otra tabla (no usuarios)").default(
        util.getEnvironment()?.loginType,
      ),
    })
    .filter(() => ["1", "eq", "1"]),
  whoami: Schema("user", "idusuario")
    .fields({
      idusuario: Field.Text("idusuario", "ID Usuario").required(),
    })
    .filter(() => ["1", "eq", "1"]),
  forgotPassword: Schema("forgot_password", "idusuario").fields({
    email: Field.Text("username", "email").required(),
    action: Field.Text(
      "action",
      "param usado para indicar que no es un login, sino un forgot password (ver si se puede borrar)",
    ).required(),
    loginType: Field.Bool("loginType", "Login sobre otra tabla (no usuarios)").default(
      util.getEnvironment()?.loginType,
    ),
  }),
  changePassword: Schema("check_hashlink", "hash").fields({
    action: Field.Text("action", "Acción").required(),
    hashcode: Field.Text("hashcode", "Hash").required(),
    password: Field.Text("password", "Contraseña").required(),
    loginType: Field.Bool("loginType", "Login sobre otra tabla (no usuarios)").default(
      util.getEnvironment()?.loginType,
    ),
  }),
  checkHashlink: Schema("check_hashlink", "hash").fields({
    // hash: Field.Text('hash', 'hash').required()
  }),
  createUser: Schema("create_user", "idusuario").fields({
    email: Field.Text("username", "email").required(),
    action: Field.Text(
      "action",
      "param usado para indicar que no es un login, sino un forgot password (ver si se puede borrar)",
    ).required(),
    loginType: Field.Bool("loginType", "Login sobre otra tabla (no usuarios)").default(
      util.getEnvironment()?.loginType,
    ),
  }),
  createUserConfirm: Schema("check_hashlink", "hash").fields({
    action: Field.Text("action", "Acción").required(),
    hashcode: Field.Text("hashcode", "Hash").required(),
    user_data: Field.Text("user_data", "Datos del usuario").required(),
    // password: Field.Text("password", "Contraseña").required(),
    loginType: Field.Bool("loginType", "Login sobre otra tabla (no usuarios)").default(
      util.getEnvironment()?.loginType,
    ),
  }),
  miusuario: Schema("usuarios", "idusuario").fields({
    idUsuario: Field.Text("idusuario", "ID"),
    nombre: Field.Text("nombre", "Nombre"),
    email: Field.Text("email", "Email"),
  }),
  // .filter(["idusuario", "eq", util?.getUser().user]),
});
