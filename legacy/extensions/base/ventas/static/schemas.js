import { Field, Schema } from "quimera/lib";

export default parent => ({
  ...parent,
  // pedidos:
  //   Schema('pedidoscli', 'idpedido')
  //     .fields({
  //       idPedido: Field.Int('idpedido', 'idPedido').auto(),
  //       codigo: Field.Text('codigo', 'Código'),
  //       fecha: Field.Date('fecha', 'Fecha'),
  //       nombreCliente: Field.Text('nombrecliente', 'Nombre Cliente').required(),
  //       codCliente: Field.Text('codcliente', 'Código de Cliente'),
  //       total: Field.Currency('total', 'Total'),
  //       totalIva: Field.Currency('totaliva', 'Total Iva'),
  //       neto: Field.Currency('neto', 'Neto'),
  //       dirTipoVia: Field.Text('dirtipovia', 'Tipo Vía'),
  //       direccion: Field.Text('direccion', 'Direccion').required(),
  //       dirNum: Field.Text('dirnum', 'Núm.'),
  //       dirOtros: Field.Text('dirotros', 'Otros'),
  //       codPostal: Field.Text('codpostal', 'Cód. Postal'),
  //       ciudad: Field.Text('ciudad', 'Ciudad'),
  //       provincia: Field.Text('provincia', 'Provincia'),
  //       codDir: Field.Float('coddir', 'Cód. Dir.'),
  //       codAgente: Field.Text('codagente', 'Agente'),
  //       cifNif: Field.Text('cifnif', 'CIF/NIF').required(),
  //       editable: Field.Bool('editable', 'Editable')
  //     })
  //     .filter(() => ['1', 'eq', '1'])
  //     .order(() => ({ field: 'codigo', direction: 'DESC' })),
  presupuestosCli: Schema("presupuestoscli", "idpresupuesto")
    .fields({
      idPresupuesto: Field.Int("idpresupuesto", "idPresupuesto").auto(),
      codigo: Field.Text("codigo", "Código"),
      fecha: Field.Date("fecha", "Fecha"),
      nombreCliente: Field.Text("nombrecliente", "Nombre Cliente").required(),
      codCliente: Field.Text("codcliente", "Código de Cliente"),
      total: Field.Currency("total", "Total"),
      totalIva: Field.Currency("totaliva", "Total Iva"),
      neto: Field.Currency("neto", "Neto"),
      dirTipoVia: Field.Text("dirtipovia", "Tipo Vía"),
      direccion: Field.Text("direccion", "Direccion").required(),
      dirNum: Field.Text("dirnum", "Núm."),
      dirOtros: Field.Text("dirotros", "Otros"),
      codPostal: Field.Text("codpostal", "Cód. Postal"),
      ciudad: Field.Text("ciudad", "Ciudad"),
      provincia: Field.Text("provincia", "Provincia"),
      codDir: Field.Float("coddir", "Cód. Dir."),
      codAgente: Field.Text("codagente", "Agente"),
      cifNif: Field.Text("cifnif", "CIF/NIF").required(),
      editable: Field.Bool("editable", "Editable"),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "fecha", direction: "DESC" })),
  pedidoCliNuevo: Schema("pedidoscli", "idpedido").fields({
    codDir: Field.Int("coddir", "Id. Dir").required(),
    codCliente: Field.Text("codcliente", "Cliente").required(),
  }),
  presupuestoCliNuevo: Schema("presupuestoscli", "idpresupuesto").fields({
    codDir: Field.Int("coddir", "Id. Dir").required(),
    codCliente: Field.Text("codcliente", "Cliente").required(),
  }),
  pedidos: Schema("pedidoscli", "idpedido")
    .fields({
      idPedido: Field.Int("idpedido", "idPedido").auto(),
      codigo: Field.Text("codigo", "Código"),
      fecha: Field.Date("fecha", "Fecha"),
      nombreCliente: Field.Text("nombrecliente", "Nombre Cliente").required(),
      codCliente: Field.Text("codcliente", "Código de Cliente"),
      total: Field.Currency("total", "Total"),
      totalIva: Field.Currency("totaliva", "Total Iva"),
      neto: Field.Currency("neto", "Neto"),
      dirTipoVia: Field.Text("dirtipovia", "Tipo Vía"),
      direccion: Field.Text("direccion", "Direccion").required(),
      dirNum: Field.Text("dirnum", "Núm."),
      dirOtros: Field.Text("dirotros", "Otros"),
      codPostal: Field.Text("codpostal", "Cód. Postal"),
      ciudad: Field.Text("ciudad", "Ciudad"),
      provincia: Field.Text("provincia", "Provincia"),
      codDir: Field.Float("coddir", "Cód. Dir."),
      codAgente: Field.Text("codagente", "Agente"),
      cifNif: Field.Text("cifnif", "CIF/NIF").required(),
      editable: Field.Bool("editable", "Editable"),
      servido: Field.Text("servido", "Servido"),
      observaciones: Field.TextArea("observaciones", "Observaciones"),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "fecha", direction: "DESC" })),
  lineaspedidos: Schema("lineaspedidoscli", "idlinea")
    .fields({
      idLinea: Field.Int("idlinea", "idLinea").auto(),
      idPedido: Field.Int("idpedido", "idPedido"),
      referencia: Field.Text("referencia", "Referencia"),
      descripcion: Field.Text("descripcion", "Descripción"),
      cantidad: Field.Currency("cantidad", "Cantidad"),
      pvpUnitario: Field.Currency("pvpunitario", "PVP Unitario"),
      pvpTotal: Field.Currency("pvptotal", "Total"),
      porComision: Field.Float("porcomision", "% Comisión"),
    })
    .filter(({ pedidos }) => ["idpedido", "eq", pedidos.current]),
  lineasPedidosCli: Schema("lineaspedidoscli", "idlinea")
    .fields({
      idLinea: Field.Int("idlinea", "idLinea").auto(),
      idPedido: Field.Int("idpedido", "idPedido"),
      referencia: Field.Text("referencia", "Referencia"),
      descripcion: Field.Text("descripcion", "Descripción").required(),
      cantidad: Field.Float("cantidad", "Cantidad").required().default(0),
      codImpuesto: Field.Text("codimpuesto", "I.V.A."),
      iva: Field.Float("iva", "% I.V.A.").default(0),
      recargo: Field.Float("recargo", "% Recargo").default(0),
      irpf: Field.Float("irpf", "% I.R.P.F."),
      pvpUnitario: Field.Currency("pvpunitario", "Precio unitario").required(),
      pvpSinDto: Field.Currency("pvpsindto", "Importe").required().default(0),
      dtoLineal: Field.Currency("dtolineal", "Dto. Lineal").required().default(0),
      dtoPor: Field.Float("dtopor", "% Descuento").required().default(0),
      pvpTotal: Field.Currency("pvptotal", "Total").required().default(0),
      porComision: Field.Float("porcomision", "% Comisión"),
    })
    .filter(({ pedido }) => ["idpedido", "eq", pedido.data.idPedido]),
  lineasPresupuestosCli: Schema("lineaspresupuestoscli", "idlinea")
    .fields({
      idLinea: Field.Int("idlinea", "idLinea").auto(),
      idPresupuesto: Field.Int("idpresupuesto", "idPresupuesto"),
      referencia: Field.Text("referencia", "Referencia"),
      descripcion: Field.Text("descripcion", "Descripción").required(),
      cantidad: Field.Float("cantidad", "Cantidad").required().default(0),
      codImpuesto: Field.Text("codimpuesto", "I.V.A."),
      iva: Field.Float("iva", "% I.V.A.").default(0),
      recargo: Field.Float("recargo", "% Recargo").default(0),
      irpf: Field.Float("irpf", "% I.R.P.F."),
      pvpUnitario: Field.Currency("pvpunitario", "Precio unitario").required().default(0),
      pvpSinDto: Field.Currency("pvpsindto", "Importe").required().default(0),
      dtoLineal: Field.Currency("dtolineal", "Dto. Lineal").required().default(0),
      dtoPor: Field.Float("dtopor", "% Descuento").required().default(0),
      pvpTotal: Field.Currency("pvptotal", "Total").required().default(0),
      porComision: Field.Float("porcomision", "% Comisión"),
    })
    .filter(({ presupuesto }) => ["idpresupuesto", "eq", presupuesto.data.idPresupuesto]),
  dirClientes: Schema("dirclientes", "id")
    .fields({
      codDir: Field.Int("id", "codDir").default(null),
      codCliente: Field.Text("codcliente", "Cód. Cliente"),
      direccion: Field.Text("direccion", "Dirección").required(),
      ciudad: Field.Text("ciudad", "Población").required(),
      provincia: Field.Text("provincia", "Provincia"),
      codPais: Field.Text("codpais", "Cód. País"),
      codPostal: Field.Text("codpostal", "Cód. Postal"),
      dirTipoVia: Field.Text("dirtipovia", "T. Vía"),
      dirNum: Field.Text("dirnum", "Núm."),
      dirOtros: Field.Text("dirotros", "Otros"),
    })
    .extract(),
});
