import { util } from "quimera";
import { Field, Schema } from "quimera/lib";

const validationCantidadesLineasDevolucion = data =>
  data.lista
    .filter(lineaItem => lineaItem.idLineaPc === data.linea.idLineaPc)
    .reduce((accum, item) => accum + item.cantidadOk + item.cantidadKo, 0) >
  data.linea.cantidadFactura && {
    error: true,
    message: "",
  };

export default parent => {
  console.log("PARENT", parent);

  return {
    ...parent,
    pedidoCliNuevo: parent.pedidoCliNuevo.fields({
      sh_ctrlestadoborr: Field.Bool("sh_ctrlestadoborr", "Borrador").default(true),
      fechaSalida: Field.Bool("fechasalida", "Fecha salida").default(util.today()),
      regimenIva: Field.Text("regimeniva", "Origen mercancia").default(null),
      codEvento: Field.Text("codevento", "Evento").default(null).required(),
    }),
    presupuestoCliNuevo: parent.presupuestoCliNuevo.fields({
      codEvento: Field.Text("sh_codevento", "Evento").default(null).required(),
      idTrato: Field.Text("idtrato", "idtrato").default(null).required(),
      agente: Field.Text("codagente", "Agente").default(() => util.getUser().agente),
      codAgenteMkt: Field.Text("codagentemkt", "Agente marketing").default(null),
      regimenIva: Field.Text("regimeniva", "Origen mercancia").default(null),
    }),
    // presupuestoCliNuevo: Schema("presupuestoscli", "idpresupuesto").fields({
    //   codDir: Field.Int("coddir", "Id. Dir").required(),
    //   codCliente: Field.Text("codcliente", "Cliente").required(),
    // })
    presupuestoCliNuevoNoRegistrado: Schema("presupuestoscli", "idpresupuesto").fields({
      nombre: Field.Text("nombrecliente", "Cliente").default(null).required(),
      direccion: Field.Text("direccion", "Dirección").default(null),
      // coddir: Field.Int("coddir", "Id. Dir").default(null),
      // codCliente: Field.Text("codcliente", "Cliente").default(null),
      cifnif: Field.Text("cifnif", "CIFNIF").default("-"),
      agente: Field.Text("codagente", "Agente").default(() => util.getUser().agente),
      codAgenteMkt: Field.Text("codagentemkt", "Agente marketing").default(null),
      codEvento: Field.Text("sh_codevento", "Evento").default(null).required(),
      idTrato: Field.Text("idtrato", "idtrato").default(null).required(),
    }),
    articulos: parent.articulos.fields({
      factorSustitucion: Field.Float("sh_factorsust", "Factor"),
      refSustitutivo: Field.Text("refsustitutivo", "Sustitutivo"),
      enSustitucion: Field.Bool("ensustitucion", "En sustitución"),
    }),
    presupuestosCli: parent.presupuestosCli.fields({
      codEvento: Field.Text("sh_codevento", "Evento"),
      nombreEvento: Field.Text("sh_nombreevento", "Nombre evento").dump(false),
      observaciones: Field.TextArea("observaciones", "Observaciones"),
    }),
    pedidos: parent.pedidos.fields({
      enBorrador: Field.Bool("sh_ctrlestadoborr", "En borrador").dump(false),
      estadoPda: Field.Float("sh_estadopedidopda", "Estado PDA"),
      email: Field.Float("email", "Email").dump(false),
      codEvento: Field.Text("codevento", "Evento"),
      nombreEvento: Field.Text("sh_nombreevento", "Nombre evento").dump(false),
    }),
    devolPedidos: Schema("pedidoscli", "idpedido").fields({
      id: Field.Int("idpedido", "ID").auto(),
      codigo: Field.Text("codigo"),
      codCliente: Field.Text("codcliente", "Cliente"),
      servido: Field.Text("servido", "Servido"),
      estadopago: Field.Text("sh_estadopago", "Estado"),
      fecha: Field.Date("fecha", "Fecha"),
      total: Field.Float("total", "Total"),
      nombrecliente: Field.Text("nombrecliente", "Cliente"),
    }),
    devolFacturas: Schema("facturascli", "idfactura").fields({
      id: Field.Int("idfactura", "ID").auto(),
      codigo: Field.Text("codigo"),
    }),
    lineasDevolucion: Schema("pedidoscli", "id")
      .fields({
        id: Field.Int("id", "ID").auto(),
        referencia: Field.Text("referencia", "Referencia"),
        descripcion: Field.Text("descripcion", "Descripción"),
        codigo: Field.Text("codigo", "Cód. Lote"),
        codLote: Field.Text("codlote", "Cód. Lote"),
        fechaCaducidad: Field.Date("fechacaducidad", "F. Caducidad"),
        cantidadFactura: Field.Float("cantidad_factura", "Cantidad"),
        cantidadOk: Field.Float("cantidadok", "Correcta")
          .default(0.0)
          .validation(validationCantidadesLineasDevolucion),
        cantidadKo: Field.Float("cantidadko", "Dañada")
          .default(0.0)
          .validation(validationCantidadesLineasDevolucion),
        idLineaPc: Field.Int("idlineapc", "Linea Pedido"),
      })
      .filter(({ idPedido }) => idPedido)
      .limit(9999),
    preparadoDevolucion: Schema("pedidoscli", "id").fields({
      lineasLotesDevolucion: Field.Text("lineasLotesDevolucion", "lineas").dump(lineas => lineas),
    }),
    pedidosXAgente: Schema("i_sh_pedidosxagente", "codagente")
      .fields({
        codAgente: Field.Text("cod-agente", "Agente"),
        nombre: Field.Text("nombre", "Nombre"),
        totalPresupuestos: Field.Int("total-presupuestos", "Total presupuestos"),
        totalAceptados: Field.Int("total-aceptados", "Total aceptados"),
        totalPedidos: Field.Int("total-pedidos", "Total pedidos"),
        importePedidoMedio: Field.Int("importe-pedido-medio", "Importe pedido medio"),
      })
      .limit(9999),
    historicoPedidosCliente: Schema("clientes", "referencia")
      .fields({
        referencia: Field.Text("referencia", "Referencia"),
        descripcion: Field.Text("descripcion", "Descripción"),
        multiplo: Field.Int("sh_canmultiplovta", "Múltiplo"),
        fecha: Field.Date("fecha", "Fecha"),
        disponible: Field.Float("disponible", "Disponible"),
      })
      .filter(({ pedido }) => ["codcliente", "eq", pedido?.buffer.codCliente])
      .order(() => ({ field: "fecha", direction: "DESC" })),
    // .limit(10),
    historicoPresupuestosCliente: Schema("clientes", "referencia")
      .fields({
        referencia: Field.Text("referencia", "Referencia"),
        descripcion: Field.Text("descripcion", "Descripción"),
        multiplo: Field.Int("sh_canmultiplovta", "Múltiplo"),
        fecha: Field.Date("fecha", "Fecha"),
        disponible: Field.Float("disponible", "Disponible"),
      })
      .filter(({ presupuesto }) => ["codcliente", "eq", presupuesto?.buffer.codCliente])
      .order(() => ({ field: "fecha", direction: "DESC" })),
    // .limit(10),
    clientesComparativa: Schema("i_sh_clientescomparativa", "codcliente").fields({
      codCliente: Field.Text("codcliente", "codigo"),
      nombreCliente: Field.Text("nombrecliente", "nombreCliente"),
      dirtipovia: Field.Text("dirtipovia", "dirtipovia"),
      direccion: Field.Text("direccion", "direccion"),
      dirnum: Field.Text("dirnum", "dirnum"),
      ciudad: Field.Text("ciudad", "ciudad"),
      codpostal: Field.Text("codpostal", "codpostal"),
      telefono: Field.Text("telefono", "telefono"),
      email: Field.Text("email", "email"),
      totalUno: Field.Float("totalUno", "totalUno").default(0),
      totalDos: Field.Float("totalDos", "totalDos").default(0),
      variacion: Field.Float("variacion", "variacion").default(0),
    }),
    articulosClientesComparativa: Schema("i_sh_articulosclientescomparativa", "codcliente").fields({
      referencia: Field.Text("referencia", "referencia"),
      descripcion: Field.Text("descripcion", "descripcion"),
      cantidadUno: Field.Int("cantidadUno", "cantidadUno"),
      cantidadDos: Field.Int("cantidadDos", "cantidadDos"),
    }),
    clientesInactivos: Schema("i_sh_clientesinactivos", "codcliente").fields({
      codCliente: Field.Text("codcliente", "codigo"),
      nombreCliente: Field.Text("nombrecliente", "nombreCliente"),
      dirtipovia: Field.Text("dirtipovia", "dirtipovia"),
      direccion: Field.Text("direccion", "direccion"),
      dirnum: Field.Text("dirnum", "dirnum"),
      ciudad: Field.Text("ciudad", "ciudad"),
      codpostal: Field.Text("codpostal", "codpostal"),
      telefono: Field.Text("telefono", "telefono"),
      email: Field.Text("email", "email"),
      fecha: Field.Date("fecha", "fecha"),
    }),
    clientesNuevos: Schema("i_sh_clientesnuevos", "codcliente").fields({
      codCliente: Field.Text("codcliente", "codigo"),
      nombreCliente: Field.Text("nombrecliente", "nombreCliente"),
      dirtipovia: Field.Text("dirtipovia", "dirtipovia"),
      direccion: Field.Text("direccion", "direccion"),
      dirnum: Field.Text("dirnum", "dirnum"),
      ciudad: Field.Text("ciudad", "ciudad"),
      codpostal: Field.Text("codpostal", "codpostal"),
      telefono: Field.Text("telefono", "telefono"),
      email: Field.Text("email", "email"),
      fecha: Field.Date("fecha", "fecha"),
    }),
    clientesVentaArt: Schema("i_clientesventaart", "codagente").fields({}),
    consumoCliente: Schema("i_sh_consumocliente", "codagente").fields({}),
    ventasArticulo: Schema("i_sh_ventasarticulo", "codagente").fields({}),
    ventasFamilia: Schema("i_sh_ventasfamilia", "codagente").fields({}),
    ventasPedidosSan: Schema("i_sh_ventaspedidos", "codagente").fields({}),
    ventasPoblacion: Schema("i_sh_ventaspoblacion", "codagente").fields({}),
    presupuestoCliToPDF: Schema("presupuestoscli", "id").fields({}),
    lineasPedidosCli: parent.lineasPedidosCli.fields({
      multiplo: Field.Bool("sh_canmultiplovta", "Múltiplo").dump(false),
      cantidad: Field.Float("cantidad", "Cantidad")
        .required()
        .default(0)
        .validation(linea => {
          return (
            linea.multiplo &&
            linea.cantidad % linea.multiplo !== 0 && {
              error: true,
              message: `La cantidad debe ser múltiplo de ${linea.multiplo}`,
            }
          );
        }),
      canServida: Field.Float("totalenalbaran", "Servida").default(0),
      dtoManual: Field.Bool("dtomanual", "Dto.Manual").default(false),
    }),
    lineasPresupuestosCli: parent.lineasPresupuestosCli.fields({
      dtoManual: Field.Bool("dtomanual", "Dto.Manual").default(false),
    }),
    tratosAgente: Schema("ss_tratos", "codagente").fields({}),
    contactosAgente: Schema("ss_contactos_agente", "codagente").fields({}),
    crearPedidoDevolucion: Schema("pedidoscli", "id").fields({
      idFactura: Field.Text("idFactura", "idFactura"),
      razonDevolucion: Field.Text("razonDevolucion", "razonDevolucion"),
      lineasConDevoluciones: Field.Text("lineasConDevoluciones", "lineasConDevoluciones"),
    }),
    checkStockLinea: Schema("stocks", "idstock").fields({
      idStock: Field.Text("idstock", "Id"),
      referencia: Field.Text("referencia", "Referencia"),
      codAlmacen: Field.Text("codalmacen", "Almacén"),
      disponible: Field.Float("disponible", "Disponible"),
    }),
    previsionCompras: Schema("sh_previsioncompras", "id").fields({
      idArticuloProv: Field.Int("idarticuloprov", "ID Artículo Prov"),
      codProveedor: Field.Text("codproveedor", "Cod. Proveedor"),
      nombreProveedor: Field.Text("nombreproveedor", "Proveedor"),
      referencia: Field.Text("referencia", "Referencia"),
      descripcion: Field.Text("descripcion", "Artículo"),
      aPedir: Field.Int("apedir", "A Pedir"),
      enStock: Field.Int("cantidad", "Actual"),
      reservada: Field.Int("reservada", "Por Servir"),
      pteRecibir: Field.Int("pterecibir", "Por Recibir"),
      plazoProveedor: Field.Int("plazoproveedor", "Días"),
      stockMin: Field.Int("stockmin", "S.Min"),
      stockMax: Field.Int("stockmax", "S.Max"),
      stockSeg: Field.Int("stockseg", "S.Seg"),
      coste: Field.Float("coste", "Coste"),
      dto: Field.Float("dto", "%Dto"),
      diasServicio: Field.Int("diasservicio", "Días"),
      fechaPR: Field.Text("fechapr", "Fecha Pte. Recibir"),
      pedidoMin: Field.Int("pedidomin", "Pedido Min"),
      volumen: Field.Float("volumen", "Vol.Art.").decimals(6),
      personalizado: Field.Bool("personalizado", "Personalizado"),
      uniEmbalaje: Field.Int("uniembalaje", "U/E"),
      requiereEmbalajes: Field.Bool("requiereembalajes", "R.E."),
      tT1: Field.Float("tT1", "T1"),
      tT2: Field.Float("tT2", "T2"),
      tT3: Field.Float("tT3", "T3"),
      tT4: Field.Float("tT4", "T4"),
      tTotal: Field.Float("tTotal", "Total"),
      consumoMensualIA: Field.Int("consumomensualia", "!C.M."),
      diasServicioIA: Field.Int("diasservicioia", "!D.S."),
      factorSeguridadIA: Field.Int("factorseguridadia", "!F.S."),
      aPedirIA: Field.Int("apediria", "!A Pedir"),
      consumoMensual: Field.Int("consumomensual", "Consumo Mensual"),
      ultCantEnt: Field.Int("ultcantent", "Última Cant. Ent."),
      importeMinimo: Field.Int("importeminimo", "P.Min"),
      importePedido: Field.Int("importepedido", "Importe"),
      volumenMinimo: Field.Int("volumenminimo", "V.Min"),
      volumenPedido: Field.Int("volumenpedido", "Volumen"),
      factorSeguridadProducto: Field.Int("factorseguridadprod", "FS. Prod."),
      factorSeguridadProveedor: Field.Int("factorseguridadprov", "FS. Prov."),
      idFormulaCantidad: Field.Int("idformulacantidad", "FCC"),
      idFormulaSeguridad: Field.Int("idformulaseguridad", "FSS"),
      ordenConfiguracion: Field.Text("ordenconfiguracion", "Orden"),
      selection: Field.Bool("selection", "Incluido"),
    }),
    peticionPrevisionCompras: Schema("sh_previsioncompras", "id").fields({
      codProveedor: Field.Text("codproveedor", "Cod. Proveedor"),
      codAlmacen: Field.Text("codalmacen", "Cod. Almacén"),
      fechaDesde: Field.Date("fechadesde", "Desde"),
      fechaHasta: Field.Date("fechahasta", "Hasta"),
      diasServicio: Field.Int("diasservicio", "Días de Servicio"),
      factorSeguridad: Field.Int("factorseguridad", "Factor de Seguridad"),
    }),
    peticionGenerarPedido: Schema("pedidosprov", "id").fields({
      codProveedor: Field.Text("codproveedor", "Cod. Proveedor"),
      lineas: Field.Text("lineas", "Líneas"),
    }),
  };
};
