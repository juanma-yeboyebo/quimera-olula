import { Field, Schema } from "quimera/lib";

export default {
  pedidoscli: Schema("pedidoscli", "idpedido")
    .fields({
      idPedido: Field.Text("idpedido", "ID").required(),
      codigo: Field.Text("codigo", "Código"),
      referencia: Field.Text("referencia", "Ref. Pedido"),
      fecha: Field.Date("fecha", "Fecha"),
      mx_fechaprevistainicial: Field.Date("mx_fechaprevistainicial", "Fecha prev."),
      fechasalidareal: Field.Date("fechasalidareal", "Fecha Real"),
      nombreCliente: Field.Text("nombrecliente", "Cliente"),
      total: Field.Float("total", "Total"),
      neto: Field.Float("neto", "Neto"),
      totaliva: Field.Float("totaliva", "Total IVA"),
      estado: Field.Text("estado", "Estado"),
      reclamado: Field.Bool("reclamado", "Reclamado"),
    })
    .filter(() => ["1", "eq", "1"])
    .limit(40)
    .order(() => ({ field: "idpedido", direction: "DESC" }))
    .extract(),
  lineaspedido: Schema("lineaspedidoscli","idlinea")
    .fields({
      idLinea: Field.Int("idlinea", "Id. Linea Ped"),
      idpedido: Field.Int("idpedido", "Id. Ped"),
      referencia: Field.Text("referencia", "Referencia"),
      descripcion: Field.Text("descripcion", "Descripcion"),
      cantidad: Field.Int("cantidad", "Cantidad"),
      pvpunitario: Field.Float("pvpunitario", "PVP"),
      pvptotal: Field.Float("pvptotal", "Total")
    })
    .filter(({ pedidos }) => ["idpedido", "eq", pedidos.current])  
    .limit(40)
    .extract(),
  lineasalbaran: Schema("lineasalbaranescli", "idlinea")
    .fields({
      idlinea: Field.Int("idlinea", "Id. Linea Alb"),
      idalbaran: Field.Int("idalbaran", "Id. Alb"),
      descripcion: Field.Text("descripcion", "Descripcion"),
      referencia: Field.Text("referencia", "Referencia")
    })
    .filter(({ pedidos }) => ["idpedido", "eq", pedidos.current])
    .extract(),
  albarancli: Schema("pedidoscli", "idpedido")
    .fields({
      lineas: Field.Text("lineas", "Líneas").dump(data => data.lineas)
    })
    .extract(),
};
