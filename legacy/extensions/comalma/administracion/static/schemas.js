import { Field, Schema } from "quimera/lib";

export default parent => ({
  ...parent,
  comercios: Schema("ca_comercios", "idcomercio")
    .fields({
      idComercio: Field.Int("idcomercio", "Id."),
      nombre: Field.Text("nombre", "Nombre").required(),
      email: Field.Text("email", "Email").required(),
      tipo: Field.Text("tipo", "Tipo").required(),
      cifnif: Field.Text("cifnif", "cifnif").required(),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "nombre", direction: "ASC" }))
    .limit(1000),
  comercio: Schema("ca_comercios", "idcomercio")
    .fields({
      idComercio: Field.Int("idcomercio", "Id."),
      nombre: Field.Text("nombre", "Nombre"),
      email: Field.Text("email", "Email"),
      tipo: Field.Text("tipo", "Tipo"),
      cifnif: Field.Text("cifnif", "cifnif"),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "nombre", direction: "ASC" }))
    .limit(1000),
  campanas: Schema("ca_campanas", "idcampana")
    .fields({
      idCampana: Field.Int("idcampana", "Id."),
      nombre: Field.Text("nombre", "Nombre").required(),
      fechaInicio: Field.Date("fechainicio", "Fecha Inicio").required(),
      fechaFin: Field.Date("fechafin", "Fecha Fin"),
      // topeConsumidor: Field.Currency("topeconsumidor", "Tope consumidor").default(0),
      // topeConsumidorComercio: Field.Currency(
      //   "topeconsumidorComercio",
      //   "Tope consumidor comercio",
      // ).default(0),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "nombre", direction: "ASC" }))
    .limit(1000),
  consumidores: Schema("ca_consumidores", "idconsumidor")
    .fields({
      idConsumidor: Field.Int("idconsumidor", "Id."),
      email: Field.Text("email", "Email"),
      nombre: Field.Text("nombre", "nombre"),
      apellidos: Field.Text("apellidos", "apellidos"),
      telefono: Field.Text("telefono", "Telefono"),
    })
    .filter(() => ["1", "eq", "1"])
    .limit(10000)
    .order(() => ({ field: "idconsumidor", direction: "ASC" })),
  consumidoresConsulta: Schema("ca_consumidores", "idconsumidor")
    .fields({
      idConsumidor: Field.Int("idconsumidor", "Id."),
      email: Field.Text("email", "Email"),
      cifnif: Field.Text("cifnif", "cifnif"),
      nombre: Field.Text("nombre", "nombre"),
      apellidos: Field.Text("apellidos", "apellidos"),
      telefono: Field.Text("telefono", "Telefono"),
      fechaCompra: Field.Date("fechacompra", "Fecha Compra"),
      fechaNacimiento: Field.Date("fechanacimiento", "Fecha Nacimiento"),
      cp: Field.Text("cp", "Código Postal"),
      idcomercio: Field.Int("idcomercio", "idcomercio"),
      importe: Field.Currency("importe", "Importe"),
      nombreComercio: Field.Text("nombrecomercio", "Nombre"),
      compras: Field.Text("compras", "Compras"),
    })
    .filter(() => ["1", "eq", "1"])
    .limit(10000)
    .order(() => ({ field: "idconsumidor", direction: "ASC" })),
  comerciosConsulta: Schema("ca_comercios", "idcomercio")
    .fields({
      idComercio: Field.Int("idcomercio", "Id."),
      nombre: Field.Text("nombre", "nombre"),
      fechaCompra: Field.Date("fechacompra", "Fecha Compra"),
      importe: Field.Currency("importe", "Importe"),
      ventas: Field.Text("ventas", "Ventas"),
      nombreConsumidor: Field.Text("nombreconsumidor", "nombre consumidor"),
      apellidosConsumidor: Field.Text("apellidosconsumidor", "apellidos consumidor"),
    })
    .filter(() => ["1", "eq", "1"])
    .limit(10000)
    .order(() => ({ field: "idcomercio", direction: "ASC" })),
  ventasComercio: Schema("ca_compras", "idcompra")
    .fields({
      idVenta: Field.Int("idcompra", "Id."),
      idConsumidor: Field.Text("idconsumidor", "Cliente"),
      idComercio: Field.Int("idcomercio", "Comercio"),
      idCampana: Field.Int("idcampana", "Campana"),
      importe: Field.Currency("importe", "Importe"),
      fechaVenta: Field.Date("fechacompra", "Fecha venta"),
      codTicket: Field.Text("codticket", "Ticket"),
      nombreConsumidor: Field.Text("nombreconsumidor", "Nombre consumidor"),
      apellidosConsumidor: Field.Text("apellidosconsumidor", "Apellidos"),
      cifnifconsumidor: Field.Text("cifnifconsumidor", "CIF/NIF"),
      telefonoConsumidor: Field.Text("telefonoconsumidor", "Teléfono"),
      fechaNacimientoConsumidor: Field.Date("fechanacimientoconsumidor", "Fecha Nacimiento"),
      generoConsumidor: Field.Text("generoconsumidor", "Genero"),
      emailConsumidor: Field.Text("emailconsumidor", "Email"),
      nombreComercio: Field.Text("nombrecomercio", "Nombre comercio"),
    })
    .filter(() => ["1", "eq", "1"])
    .limit(10000)
    .order(() => ({ field: "fechacompra", direction: "DESC" })),
});
