import { Field, Schema } from "quimera/lib";

export default {
  pedidoscli: Schema("mispedidos", "idpedido")
    .fields({
      idPedido: Field.Int("idpedido", "Id").required(),
      codigo: Field.Text("codigo", "Código").required(),
      referencia: Field.Text("referencia", "Referencia").required(),
      estado: Field.Text("estado", "Estado"),
      fecha: Field.Date("fecha", "Fecha").required(),
      mx_fechaPrevistaInicial: Field.Date("mx_fechaprevistainicial", "F. prevista"),
      fechaSalidaReal: Field.Date("fechasalidareal", "Fecha"),
      nombreCliente: Field.Text("nombrecliente", "Nombre Cliente"),
      total: Field.Currency("total", "Total Pedido").required(),
      totalIva: Field.Currency("totaliva", "Total IVA").required(),
      neto: Field.Currency("neto", "Neto Pedido").required(),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "fecha", direction: "DESC" }))
    .limit(1000)
    .extract(),
  lineaspedido: Schema("lineasmispedidos", "idlinea")
    .fields({
      idLinea: Field.Int("idlinea", "Id. Linea").required(),
      idPedido: Field.Int("idpedido", "Id. Pedido").required(),
      referencia: Field.Text("referencia", "Referencia"),
      descripcion: Field.Text("descripcion", "Descripcion"),
      cantidad: Field.Currency("cantidad", "Cantidad").required(),
      pvpUnitario: Field.Currency("pvpunitario", "PVP Unitario").required(),
      pvpTotal: Field.Currency("pvptotal", "PVP Total").required(),
      pvpTotalIva: Field.Currency("pvptotaliva", "PVP Total IVA").required(),
      estado: Field.Text("estado", "Estado"),
      medida: Field.Currency("medida", "Medida"),
    })
    .filter(({ pedidos }) => ["idpedido", "eq", pedidos.current])
    .extract(),
};
