import { Field, Schema } from "quimera/lib";

export default parent => ({
  ...parent,
  albaranescli: Schema("albaranescli", "idalbaran")
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
      observaciones: Field.TextArea("observaciones", "Observaciones"),
      pteFactura: Field.Bool("ptefactura","Pte Factura")
    })
    .order(() => ({ field: "fecha", direction: "DESC" }))
    .filter(() => ["1", "eq", "1"]),
  albaranCliNuevo: Schema("albaranescli", "idalbaran").fields({
    codDir: Field.Int("coddir", "Id. Dir").required(),
    codCliente: Field.Text("codcliente", "Cliente").required(),
  }),
  lineasAlbaranCli: Schema("lineasalbaranescli", "idlinea")
    .fields({
      idLinea: Field.Int("idlinea", "Id").auto(),
      cantidad: Field.Float("cantidad", "cantidad"),
      descripcion: Field.Text("descripcion", "descripcion"),
    })
    .filter(({ albaran }) => ["idalbaran", "eq", albaran.data.idAlbaran])
    .order(() => ({ field: "idlinea", direction: "ASC" })),
  firmasdealbaranes: Schema("firmasdedocumentos", "iddocumento").fields({
    idDocumento: Field.Text("iddocumento", "iddocumento"),
    tipoDocumento: Field.Text("tipodocumento", "iddocumento"),
    codigo: Field.Text("codigo", "codigo"),
    codContacto: Field.Text("codcontacto", "codContacto"),
    firmadopor: Field.Text("firmadopor", "firmadopor"),
    cifnif: Field.Text("cifnif", "cifnif"),
    puesto: Field.Text("puesto", "puesto"),
    fecha: Field.Text("fecha", "fecha"),
    hora: Field.Text("hora", "hora"),
    estado: Field.Text("estado", "estado"),
    firma: Field.Text("firma", "firma"),
  }),
  lineasAlbaranesCli: Schema("lineasalbaranescli", "idlinea")
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
});
