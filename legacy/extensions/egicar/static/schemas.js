import { Field, Schema } from "quimera/lib";

export default parent => ({
  ...parent,
  tareas: Schema("pr_tareas", "idtarea").fields({
    idTarea: Field.Text("idtarea", "Id. Tarea"),
    estado: Field.Text("estado", "Estado"),
    subestado: Field.Text("subestado", "Subestado"),
    descripcion: Field.Text("descripcion", "Descripción"),
    codOrden: Field.Text("codorden", "codorden"),
    referencia: Field.Text("referencia", "referencia"),
    articulo: Field.Text("articulo", "articulo"),
    canprogramada: Field.Float("canprogramada", "canprogramada"),
    idTipoTareaPro: Field.Int("idtipotareapro", "idtipotareapro"),
    tareaInicial: Field.Bool("tareainicial", "tarea inicial"),
    tareaFinal: Field.Bool("tareafinal", "tarea final"),
    idPedido: Field.Int("idpedido", "Id. pedido"),
  }),
  // .filter(tarea => ["idtarea", "eq", tarea?.data?.idTarea]),
  // .order(() => ({ field: "idtarea", direction: "ASC" })),
  tramosTarea: Schema("pr_tramoslotetarea", "id")
    .fields({
      id: Field.Int("id", "Id. Tramo"),
      idTarea: Field.Text("idtarea", "Id. Tarea"),
      idUsuario: Field.Text("iduser", "Id. Usuario").default("Sin usuario"),
      cantidad: Field.Float("cantidad", "Cantidad"),
      diaInicio: Field.Date("diainicio", "Día inicio"),
      diaFin: Field.Date("diafin", "Día fin"),
      tiempoInicio: Field.Time("tiempoinicio", "Tiempo inicio"),
      tiempoFin: Field.Time("tiempofin", "Tiempo fin"),
    })
    .filter(({ tarea }) => ["idtarea", "eq", tarea.idTarea]),
  ordenesproduccion: Schema("lotesstock", "codorden")
    .fields({
      // codlote: Field.Text("codlote", "codlote"),
      codOrden: Field.Text("codorden", "codorden"),
      referencia: Field.Text("referencia", "referencia"),
      descripcionArticulo: Field.Text("descripcionarticulo", "descripcionarticulo"),
      cantotal: Field.Float("cantotal", "cantotal"),
      canprogramada: Field.Float("canprogramada", "canprogramada"),
      // crearterminado: Field.Bool("crearterminado", "crearterminado"),
      estado: Field.Text("estado", "estado"),
      fechaOrden: Field.Date("fechaorden", "fechaorden"),
      codPedido: Field.Text("codpedido", "codpedido"),
      idPedido: Field.Text("idpedido", "idpedido"),
      fechaPedido: Field.Date("fechapedido", "fechapedido"),
      nombreCliente: Field.Text("nombrecliente", "nombrecliente"),
    })
    .filter(() => ["estado", "in", ["PTE", "EN CURSO"]])
    .limit(20),
  pedidoscli: Schema("pedidoscli", "idpedido").fields({
    idPedido: Field.Int("idpedido", "idpedido"),
    fecha: Field.Date("fecha", "fecha"),
    nombreCliente: Field.Text("nombrecliente", "nombrecliente"),
    codPedido: Field.Text("codigo", "codigo"),
    codCliente: Field.Text("codcliente", "codcliente"),
    // referencia: Field.Text("referencia", "referencia"),
    // descripcionArticulo: Field.Text("descripcionarticulo", "descripcionarticulo"),
    // cantotal: Field.Float("cantotal", "cantotal"),
    // canprogramada: Field.Float("canprogramada", "canprogramada"),
    // crearterminado: Field.Bool("crearterminado", "crearterminado"),
    // estado: Field.Text("estado", "estado"),
    // codpedido: Field.Text("codpedido", "codpedido"),
    // fechaPedido: Field.Date("fechapedido", "fechapedido"),
  }),
  // .filter(() => ["estado", "in", ["PTE", "EN CURSO"]]),
  misLineasPedido: Schema("lineaspedidoscli", "idlinea")
    .fields({
      idLinea: Field.Int("idlinea", "idLinea").auto(),
      idPedido: Field.Int("idpedido", "idPedido"),
      referencia: Field.Text("referencia", "Referencia"),
      descripcion: Field.Text("descripcion", "Descripción").required(),
      canProgramada: Field.Float("canprogramada", "Cantidad programada").required().default(0),
      canDisponible: Field.Float("candisponible", "Cantidad disponible").required().default(0),
      canServida: Field.Float("totalenalbaran", "Cantidad servida").required().default(0),
      cantAEnviar: Field.Float("cantaenviar", "Cantidad a enviar").required().default(0),
    })
    .filter(({ pedido }) => ["idpedido", "eq", pedido.data.idPedido]),
  crearAlbaranParcial: Schema("pedidoscli", "idpedido").fields({
    idPedido: Field.Int("idpedido", "idPedido"),
    lineas: Field.Text("lineas", "Líneas"),
  }),
  utillajes: Schema("pr_tareas", "idtarea").fields({
    utillajes: Field.Text("utillajes", "utillajes"),
    observaciones: Field.Text("observaciones", "observaciones"),
  }),
});
