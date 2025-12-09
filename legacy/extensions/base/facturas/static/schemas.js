import { Field, Schema } from "quimera/lib";

export default parent => ({
  ...parent,
  facturascli: Schema("facturascli", "idfactura")
    .fields({
      idFactura: Field.Int("idfactura", "idfactura").auto(),
      nombreCliente: Field.Text("nombrecliente", "Nombre cliente"),
      codCliente: Field.Text("codcliente", "codcliente"),
      codAgente: Field.Text("codagente", "codagente"),
      codigo: Field.Text("codigo", "codigo"),
      fecha: Field.Date("fecha", "fecha"),
      // firmado: Field.Bool("firmado", "firmado"),
      // firmadoPor: Field.Text("firmadopor", "Firmado por"),
      direccion: Field.Text("direccion", "direccion"),
      codpostal: Field.Text("codpostal", "codpostal"),
      ciudad: Field.Text("ciudad", "ciudad"),
      provincia: Field.Text("provincia", "provincia"),
      total: Field.Currency("total", "Total"),
      totalIva: Field.Currency("totaliva", "Total Iva"),
      neto: Field.Currency("neto", "Neto"),
      observaciones: Field.TextArea("observaciones", "Observaciones"),
      editable: Field.Bool("editable", "Editable"),
    })
    .order(() => ({ field: "fecha", direction: "DESC" }))
    .filter(() => ["1", "eq", "1"]),
  facturaCliNueva: Schema("facturascli", "idfactura").fields({
      codDir: Field.Int("coddir", "Id. Dir").required(),
      codCliente: Field.Text("codcliente", "Cliente").required(),
    }),
  lineasFacturaCli: Schema("lineasfacturascli", "idlinea")
    .fields({
      idLinea: Field.Int("idlinea", "Id").auto(),
      cantidad: Field.Float("cantidad", "cantidad"),
      descripcion: Field.Text("descripcion", "descripcion"),
    })
    .filter(({ factura }) => ["idfactura", "eq", factura.data.idFactura])
    .order(() => ({ field: "idlinea", direction: "ASC" })),
  lineasFacturasCli: Schema("lineasfacturascli", "idlinea")
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
