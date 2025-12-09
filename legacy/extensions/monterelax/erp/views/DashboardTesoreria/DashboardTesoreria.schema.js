import { Field, Schema } from "quimera/lib";

export default {
  reciboscli: Schema("reciboscli", "idrecibo")
    .fields({
      id: Field.Int("idrecibo", "Id"),
      codigo: Field.Text("codigo", "Código"),
      estado: Field.Text("estado", "Estado"),
      fecha: Field.Date("fecha", "Fecha"),
      fechav: Field.Date("fechav", "F. vencimiento"),
      importe: Field.Float("importe", "Importe"),
      idfactura: Field.Text("idfactura", "Id. Factura"),
      codcuentapago: Field.Text("codcuentapago", "Cod. Cuenta"),
      codpago: Field.Text("codpago", "Tipo Pago"),
    })
    .filter(() => ["1", "eq", "1"])
    .limit(1000)
    .extract(),
  recibosprov: Schema("recibosprov", "idrecibo")
    .fields({
      id: Field.Int("idrecibo", "Id"),
      codigo: Field.Text("codigo", "Código"),
      estado: Field.Text("estado", "Estado"),
      fecha: Field.Date("fecha", "Fecha"),
      fechav: Field.Date("fechav", "F. vencimiento"),
      importe: Field.Float("importe", "Importe"),
      idfactura: Field.Text("idfactura", "Id. Factura"),
      codcuentapago: Field.Text("codcuentapago", "Cod. Cuenta"),
      codpago: Field.Text("codpago", "Tipo Pago"),
    })
    .filter(() => ["1", "eq", "1"])
    .limit(1000)
    .extract(),
  tesomanual: Schema("tesomanual", "idrecibo")
    .fields({
      id: Field.Int("idrecibo", "Id"),
      codigo: Field.Text("codigo", "Código"),
      estado: Field.Text("estado", "Estado"),
      fecha: Field.Date("fecha", "Fecha"),
      fechav: Field.Date("fechav", "F. vencimiento"),
      importe: Field.Float("importe", "Importe"),
      codcuentapago: Field.Text("codcuentapago", "Cod. Cuenta"),
      tipo: Field.Text("tipo", "Tipo Pago"),
    })
    .filter(() => ["1", "eq", "1"])
    .limit(1000)
    .extract(),
};
