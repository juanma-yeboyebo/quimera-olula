import { util } from "quimera";
import { Field, Schema } from "quimera/lib";

export default parent => ({
  ...parent,
  compras: Schema("ca_compras", "idcompra")
    .fields({
      idCompra: Field.Int("idcompra", "Id."),
      idConsumidor: Field.Text("idconsumidor", "Cliente"),
      idComercio: Field.Int("idcomercio", "Comercio"),
      idCampana: Field.Int("idcampana", "Campana"),
      importe: Field.Currency("importe", "Importe"),
      fechaCompra: Field.Date("fechacompra", "Fecha Compra"),
      codTicket: Field.Text("codticket", "Ticket"),
      nombreConsumidor: Field.Text("nombreconsumidor", "Nombre"),
      apellidosConsumidor: Field.Text("apellidosconsumidor", "Apellidos"),
      cifnifconsumidor: Field.Text("cifnifconsumidor", "CIF/NIF"),
      telefonoConsumidor: Field.Text("telefonoconsumidor", "Teléfono"),
      fechaNacimientoConsumidor: Field.Text("fechanacimientoconsumidor", "Fecha Nacimiento"),
      generoConsumidor: Field.Text("generoconsumidor", "Genero"),
      emailConsumidor: Field.Text("emailconsumidor", "Email"),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "fechacompra", direction: "ASC" })),
  ventas: Schema("ca_compras", "idcompra")
    .fields({
      idVenta: Field.Int("idcompra", "Id."),
      idConsumidor: Field.Text("idconsumidor", "Cliente"),
      idComercio: Field.Int("idcomercio", "Comercio"),
      idCampana: Field.Int("idcampana", "Campana"),
      importe: Field.Currency("importe", "Importe"),
      fechaVenta: Field.Date("fechacompra", "Fecha venta"),
      codTicket: Field.Text("codticket", "Ticket"),
      nombreConsumidor: Field.Text("nombreconsumidor", "Nombre"),
      apellidosConsumidor: Field.Text("apellidosconsumidor", "Apellidos"),
      cifnifconsumidor: Field.Text("cifnifconsumidor", "CIF/NIF"),
      telefonoConsumidor: Field.Text("telefonoconsumidor", "Teléfono"),
      fechaNacimientoConsumidor: Field.Text("fechanacimientoconsumidor", "Fecha Nacimiento"),
      generoConsumidor: Field.Text("generoconsumidor", "Genero"),
      emailConsumidor: Field.Text("emailconsumidor", "Email"),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "fechacompra", direction: "DESC" })),
  nuevaCompraNuevoCli: Schema("ca_compras", "idcompra")
    .fields({
      idCompra: Field.Int("idcompra", "Id."),
      idConsumidor: Field.Text("idconsumidor", "Cliente"),
      idComercio: Field.Int("idcomercio", "Comercio"),
      idCampana: Field.Int("idcampana", "Campana"),
      importe: Field.Currency("importe", "Importe").validation(
        ({ importe }) =>
          importe <= 0 && {
            error: true,
            message: "El importe debe ser mayor de 0",
          },
      ),
      fechaCompra: Field.Date("fechacompra", "Fecha Compra").required().default(util.today()),
      codTicket: Field.Text("codticket", "Ticket"),
      emailconsumidor: Field.Text("email", "Email"),
      telefonoconsumidor: Field.Text("telefonoconsumidor", "Teléfono"),
      cifnifconsumidor: Field.Text("cifnifconsumidor", "Cif/Nif").required(),
      nombreConsumidor: Field.Text("nombreconsumidor", "Nombre").required(),
      apellidosConsumidor: Field.Text("apellidosconsumidor", "Apellidos").required(),
      fechaNacimientoConsumidor: Field.Text("fechanacimientoconsumidor", "Fecha Nacimiento"),
      generoConsumidor: Field.Text("generoconsumidor", "Genero"),
      emailConsumidor: Field.Text("emailconsumidor", "Email"),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "idcompra", direction: "ASC" })),
  nuevaVentaNuevoCli: Schema("ca_compras", "idcompra")
    .fields({
      idVenta: Field.Int("idcompra", "Id."),
      idConsumidor: Field.Text("idconsumidor", "Cliente"),
      idComercio: Field.Int("idcomercio", "Comercio"),
      idCampana: Field.Int("idcampana", "Campana"),
      importe: Field.Currency("importe", "Importe").validation(
        ({ importe }) =>
          importe <= 0 && {
            error: true,
            message: "El importe debe ser mayor de 0",
          },
      ),
      fechaVenta: Field.Date("fechacompra", "Fecha venta").required().default(util.today()),
      codTicket: Field.Text("codticket", "Ticket"),
      emailconsumidor: Field.Text("email", "Email"),
      telefonoconsumidor: Field.Text("telefonoconsumidor", "Teléfono"),
      cifnifconsumidor: Field.Text("cifnifconsumidor", "Cif/Nif").required(),
      nombreConsumidor: Field.Text("nombreconsumidor", "Nombre").required(),
      apellidosConsumidor: Field.Text("apellidosconsumidor", "Apellidos").required(),
      fechaNacimientoConsumidor: Field.Text("fechanacimientoconsumidor", "Fecha Nacimiento"),
      generoConsumidor: Field.Text("generoconsumidor", "Genero"),
      emailConsumidor: Field.Text("emailconsumidor", "Email"),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "idcompra", direction: "ASC" })),
  nuevaCompraCliExistente: Schema("ca_compras", "idcompra")
    .fields({
      idCompra: Field.Int("idcompra", "Id."),
      idConsumidor: Field.Text("idconsumidor", "Cliente").required(),
      idComercio: Field.Int("idcomercio", "Comercio"),
      idCampana: Field.Int("idcampana", "Campana"),
      importe: Field.Currency("importe", "Importe").validation(
        ({ importe }) =>
          importe <= 0 && {
            error: true,
            message: "El importe debe ser mayor de 0",
          },
      ),
      fechaCompra: Field.Date("fechacompra", "Fecha Compra").required().default(util.today()),
      codTicket: Field.Text("codticket", "Ticket"),
      nombreConsumidor: Field.Text("nombreconsumidor", "Nombre"),
      apellidosConsumidor: Field.Text("apellidosconsumidor", "Apellidos"),
      cifnifConsumidor: Field.Text("cifnifconsumidor", "CIF/NIF"),
      telefonoConsumidor: Field.Text("telefonoconsumidor", "Teléfono"),
      fechaNacimientoConsumidor: Field.Text("fechanacimientoconsumidor", "Fecha Nacimiento"),
      generoConsumidor: Field.Text("generoconsumidor", "Genero"),
      emailConsumidor: Field.Text("emailconsumidor", "Email"),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "idcompra", direction: "ASC" })),
  nuevaVentaCliExistente: Schema("ca_compras", "idcompra")
    .fields({
      idVenta: Field.Int("idcompra", "Id."),
      idConsumidor: Field.Text("idconsumidor", "Cliente").required(),
      idComercio: Field.Int("idcomercio", "Comercio"),
      idCampana: Field.Int("idcampana", "Campana"),
      importe: Field.Currency("importe", "Importe").validation(
        ({ importe }) =>
          importe <= 0 && {
            error: true,
            message: "El importe debe ser mayor de 0",
          },
      ),
      fechaVenta: Field.Date("fechacompra", "Fecha venta").required().default(util.today()),
      codTicket: Field.Text("codticket", "Ticket"),
      nombreConsumidor: Field.Text("nombreconsumidor", "Nombre"),
      apellidosConsumidor: Field.Text("apellidosconsumidor", "Apellidos"),
      cifnifConsumidor: Field.Text("cifnifconsumidor", "CIF/NIF"),
      telefonoConsumidor: Field.Text("telefonoconsumidor", "Teléfono"),
      fechaNacimientoConsumidor: Field.Text("fechanacimientoconsumidor", "Fecha Nacimiento"),
      generoConsumidor: Field.Text("generoconsumidor", "Genero"),
      emailConsumidor: Field.Text("emailconsumidor", "Email"),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "idcompra", direction: "ASC" })),
  consumidores: Schema("ca_consumidores", "idconsumidor")
    .fields({
      idConsumidor: Field.Int("idconsumidor", "Id."),
      email: Field.Text("email", "Cliente"),
      cifnif: Field.Text("cifnif", "cifnif"),
      nombre: Field.Int("nombre", "nombre"),
      apellidos: Field.Currency("apellidos", "apellidos"),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "idconsumidor", direction: "ASC" })),
  comercios: Schema("ca_comercios", "idcomercio")
    .fields({
      idComercio: Field.Int("idcomercio", "Id."),
      nombre: Field.Text("nombre", "Nombre").required(),
      email: Field.Text("email", "Email").required(),
      tipo: Field.Text("tipo", "Tipo").required(),
      cifnif: Field.Text("cifnif", "cifnif").validation(
        ({ cifnif }) =>
          !cifnif ||
          (cifnif === "" && {
            error: true,
            message: "El importe debe ser mayor de 0",
          }),
      ),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "idcomercio", direction: "ASC" })),
});
