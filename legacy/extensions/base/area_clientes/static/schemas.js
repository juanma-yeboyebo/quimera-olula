import { Field, Schema } from "quimera/lib";

export default parent => ({
  ...parent,
  misPedidos: Schema("mispedidoscli", "idpedido")
    .fields({
      idPedido: Field.Int("idpedido", "idPedido").auto(),
      codigo: Field.Text("codigo", "Código"),
      fecha: Field.Date("fecha", "Fecha"),
      servido: Field.Text("servido", "Servido"),
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
  misLineasPedido: Schema("lineaspedidoscli", "idlinea")
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
      pvpUnitario: Field.Currency("pvpunitario", "Precio unitario").required().default(0),
      pvpSinDto: Field.Currency("pvpsindto", "Importe").required().default(0),
      dtoLineal: Field.Currency("dtolineal", "Dto. Lineal").required().default(0),
      dtoPor: Field.Float("dtopor", "% Descuento").required().default(0),
      pvpTotal: Field.Currency("pvptotal", "Total").required().default(0),
      porComision: Field.Float("porcomision", "% Comisión"),
    })
    .filter(({ pedido }) => ["idpedido", "eq", pedido.data.idPedido]),
  misAlbaranes: Schema("ac_albaranescli", "idalbaran")
    .fields({
      idAlbaran: Field.Int("idalbaran", "idalbaran").auto(),
      nombreCliente: Field.Text("nombrecliente", "Nombre cliente"),
      codCliente: Field.Text("codcliente", "codcliente"),
      codAgente: Field.Text("codagente", "codagente"),
      codigo: Field.Text("codigo", "Código"),
      fecha: Field.Date("fecha", "Fecha"),
      direccion: Field.Text("direccion", "direccion"),
      codpostal: Field.Text("codpostal", "codpostal"),
      ciudad: Field.Text("ciudad", "ciudad"),
      provincia: Field.Text("provincia", "provincia"),
      total: Field.Currency("total", "Total"),
      totalIva: Field.Currency("totaliva", "Total Iva"),
      neto: Field.Currency("neto", "Neto"),
    })
    .order(() => ({ field: "fecha", direction: "DESC" }))
    .filter(() => ["1", "eq", "1"]),
  misLineasAlbaran: Schema("ac_albaranescli", "idlinea")
    .fields({
      idAlbaran: Field.Int("idalbaran", "Id. Alb"),
      idLinea: Field.Int("idlinea", "Id. Linea Alb").auto(),
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
    })
    .filter(({ albaran }) => ["idalbaran", "eq", albaran.buffer.idAlbaran]),
  misFacturas: Schema("ac_facturascli", "idfactura")
    .fields({
      idFactura: Field.Int("idfactura", "idfactura").auto(),
      nombreCliente: Field.Text("nombrecliente", "Nombre cliente"),
      codCliente: Field.Text("codcliente", "codcliente"),
      codAgente: Field.Text("codagente", "codagente"),
      codigo: Field.Text("codigo", "codigo"),
      fecha: Field.Date("fecha", "fecha"),
      direccion: Field.Text("direccion", "direccion"),
      codpostal: Field.Text("codpostal", "codpostal"),
      ciudad: Field.Text("ciudad", "ciudad"),
      provincia: Field.Text("provincia", "provincia"),
      total: Field.Currency("total", "Total"),
      totalIva: Field.Currency("totaliva", "Total Iva"),
      neto: Field.Currency("neto", "Neto"),
    })
    .order(() => ({ field: "fecha", direction: "DESC" }))
    .filter(() => ["1", "eq", "1"]),
  misLineasFactura: Schema("ac_facturascli", "idlinea")
    .fields({
      idFactura: Field.Int("idfactura", "Id. Alb"),
      idLinea: Field.Int("idlinea", "Id. Linea Alb").auto(),
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
    })
    .filter(({ factura }) => ["idfactura", "eq", factura.buffer.idFactura]),
});
