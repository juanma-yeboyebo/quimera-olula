import { Field, Schema } from "quimera/lib";

export default parent => ({
  ...parent,
  compras: Schema("ca_compras", "idcompra")
    .fields({
      idCompra: Field.Int("idcompra", "Id."),
      idConsumidor: Field.Text("idconsumidor", "Cliente"),
      idComercio: Field.Int("idcomercio", "Comercio"),
      idCampana: Field.Int("idcampana", "Campana"),
      importe: Field.Currency("importe", "importe"),
      fechaCompra: Field.Date("fechacompra", "Fecha Compra"),
      codTicket: Field.Text("codticket", "Ticket"),
      nombreConsumidor: Field.Text("nombreconsumidor", "Nombre"),
      apellidosConsumidor: Field.Text("apellidosconsumidor", "Apellidos"),
      nombreComercio: Field.Text("nombrecomercio", "Comercio"),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "fechacompra", direction: "ASC" })),
  consumidores: Schema("ca_consumidores", "idconsumidor")
    .fields({
      idConsumidor: Field.Int("idconsumidor", "Id."),
      email: Field.Text("email", "Email").required(),
      telefono: Field.Text("telefono", "Teléfono").required(),
      genero: Field.Text("genero", "Género").required(),
      cifnif: Field.Int("cifnif", "cifnif").required(),
      nombre: Field.Int("nombre", "nombre").required(),
      apellidos: Field.Currency("apellidos", "apellidos").required(),
      ciudad: Field.Text("ciudad", "Ciudad").required(),
      codPostal: Field.Text("cp", "Código postal").required(),
      provincia: Field.Text("idprovincia", "Provincia").required(),
      fechaNacimiento: Field.Date("fechanacimiento", "Fecha de nacimiento").required(),
      aceptaComunicacion: Field.Bool("aceptacomunicacion", "Acepta comunicación").required(),
      aceptaCondiciones: Field.Bool("aceptacondiciones", "Acepta condiciones")
        .validation(
          ({ aceptaCondiciones }) =>
            !aceptaCondiciones && {
              error: true,
              message: "Debes aceptar la política de privacidad",
            },
        )
        .default(false),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "idconsumidor", direction: "ASC" })),
  nuevoConsumidor: Schema("ca_consumidores", "idconsumidor")
    .fields({
      telefono: Field.Text("telefono", "Teléfono").required(),
      genero: Field.Text("genero", "Género").required(),
      cifnif: Field.Int("cifnif", "cifnif").required(),
      nombre: Field.Int("nombre", "nombre").required(),
      apellidos: Field.Currency("apellidos", "apellidos").required(),
      ciudad: Field.Text("ciudad", "Ciudad").required(),
      cp: Field.Text("cp", "Código postal").required(),
      idprovincia: Field.Text("idprovincia", "Provincia").required(),
      fechanacimiento: Field.Date("fechanacimiento", "Fecha de nacimiento").required(),
      password: Field.Text("password", "Contraseña").required(),
      aceptacomunicacion: Field.Bool("aceptacomunicacion", "Acepta comunicación").default(false),
      aceptacondiciones: Field.Bool("aceptacondiciones", "Acepta condiciones")
        .validation(
          ({ aceptacondiciones }) =>
            !aceptacondiciones && {
              error: true,
              message: "Debes aceptar la política de privacidad",
            },
        )
        .default(false),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "idconsumidor", direction: "ASC" })),
});
