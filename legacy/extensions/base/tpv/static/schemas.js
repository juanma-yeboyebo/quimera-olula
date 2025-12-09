import { util } from "quimera";
import { Field, Schema } from "quimera/lib";

import { TpvDb } from "../lib";

const descPagos = {
  CONT: "CONTADO",
  TARJ: "TARJETA",
  VALE: "VALE",
};

export default {
  ventas: Schema("tpv_comandas", "idtpv_comanda")
    .fields({
      id: Field.Int("idtpv_comanda", "ID").load(v => null),
      codigo: Field.Text("codigo", "Código")
        .load(v => null)
        .default("nueva"),
      fecha: Field.Date("fecha", "Fecha").required().default(util.today()),
      hora: Field.Time("hora", "Hora").required().default(util.now()),
      nombreCliente: Field.Text("nombrecliente", "Nombre Cliente").default("Cliente TPV"),
      codCliente: Field.Text("codcliente", "Código de Cliente").default(
        TpvDb.getPuntoVenta()?.puntoventa?.clienteTpv,
      ),
      pagado: Field.Currency("pagado", "Pagado").default(0),
      pendiente: Field.Currency("pendiente", "Pendiente").default(0),
      neto: Field.Currency("neto", "Neto").default(0),
      totalIva: Field.Currency("totaliva", "Total Iva").default(0),
      total: Field.Currency("total", "Total").required().default(0),
      cerrada: Field.Bool("cerrada", "Cerrada").default(false),
      agente: Field.Text("codtpv_agente", "Cod. Agente").load(() => util.getUser().tpv_agente),
      puntoventa: Field.Text("codtpv_puntoventa", "Punto venta").load(
        () => TpvDb.getPuntoVenta()?.puntoventa?.codigo,
      ),
      sincronizada: Field.Bool("sincronizada", "Sincronizada").default(false),
      lineas: Field.Text("lineas", "Líneas")
        .load(venta => venta.lineas ?? [])
        .default([]),
      pagos: Field.Text("pagos", "Pagos")
        .load(venta => venta.pagos ?? [])
        .default([]),
    })
    .filter(() => ["1", "eq", "1"])
    .extract(),
  lineas: Schema("tpv_lineascomanda", "idtpv_linea")
    .fields({
      idLinea: Field.Int("idtpv_linea", "ID").auto(),
      idVenta: Field.Int("idtpv_comanda", "idVenta"),
      referencia: Field.Text("referencia", "Referencia"),
      descripcion: Field.Text("descripcion", "Descripción").required(),
      cantidad: Field.Float("cantidad", "Cantidad").required().default(1),
      codImpuesto: Field.Text("codimpuesto", "I.V.A."),
      iva: Field.Float("iva", "% I.V.A."),
      recargo: Field.Float("recargo", "% Recargo").default(0),
      irpf: Field.Float("irpf", "% I.R.P.F.").default(0),
      pvpUnitario: Field.Currency("pvpunitario", "Precio unitario").required(),
      pvpSinDto: Field.Currency("pvpsindto", "Importe").required(),
      dtoLineal: Field.Currency("dtolineal", "Dto. Lineal").required().default(0),
      dtoPor: Field.Float("dtopor", "% Descuento").required().default(0),
      pvpTotal: Field.Currency("pvptotal", "Total").required().default(0),
    })
    .filter(({ ventas }) => ["idtpv_comanda", "eq", ventas.current])
    .extract(),
  pagos: Schema("tpv_pagoscomanda", "idpago")
    .fields({
      idPago: Field.Int("idpago", "ID Pago"),
      idVenta: Field.Int("idtpv_comanda", "idVenta"),
      importe: Field.Currency("importe", "Importe").default(0),
      formaPago: Field.Text("codpago", "Forma Pago"),
      fecha: Field.Date("fecha", "Dia Inicio").required().default(util.today()),
      puntoventa: Field.Text("codtpv_puntoventa", "Punto Venta")
        .required()
        .default(TpvDb.getPuntoVenta()?.puntoventa?.codigo),
      agente: Field.Text("codtpv_agente", "Agente Apertura")
        .required()
        .load(() => util.getUser().tpv_agente),
    })
    .filter(({ ventas }) => ["idtpv_comanda", "eq", ventas.current])
    .extract(),
  arqueos: Schema("tpv_arqueos", "idtpv_arqueo")
    .fields({
      id: Field.Text("idtpv_arqueo", "ID").required(),
      abierta: Field.Bool("abierta", "Estado").required().default(true),
      diadesde: Field.Date("diadesde", "Dia Inicio").required().default(util.today()),
      horadesde: Field.Text("horadesde", "Hora Inicio").required().default(util.now()),
      diahasta: Field.Date("diahasta", "Dia Fin"),
      horahasta: Field.Text("horahasta", "Hora Fin"),
      ptoventa: Field.Text("ptoventa", "Punto Venta")
        .required()
        .default(TpvDb.getPuntoVenta()?.puntoventa?.codigo),
      inicio: Field.Currency("inicio", "Importe Inicial").required().default(0),
      codtpv_agenteapertura: Field.Text("codtpv_agenteapertura", "Agente Apertura")
        .required()
        .load(() => util.getUser().tpv_agente),
      codtpv_agentecierre: Field.Text("codtpv_agentecierre", "Agente Cierre"),
      valorcantmonedas: Field.Text("valorcantmonedas", "Cantidad Monedas").default(
        "2|0;1|0;0.50|0;0.20|0;0.10|0;0.05|0;0.02|0;0.01|0;",
      ),
      valorcantbilletes: Field.Text("valorcantbilletes", "Cantidad Billetes").default(
        "500|0;200|0;100|0;50|0;20|0;10|0;5|0;",
      ),
      //TOTALES
      totalmov: Field.Currency("totalmov", "Total Movimiento").required().default(0),
      totalcaja: Field.Currency("totalcaja", "Total Caja").required().default(0),
      totaltarjeta: Field.Currency("totaltarjeta", "Total Tarjeta").required().default(0),
      totalvale: Field.Currency("totalvale", "Total Vales").required().default(0),
      //PAGOS
      pagosefectivo: Field.Currency("pagosefectivo", "Pagos Efectivo").required().default(0),
      pagostarjeta: Field.Currency("pagostarjeta", "Pagos Tarjeta").required().default(0),
      pagosvale: Field.Currency("pagosvale", "Pagos Vales").default(0),
      //DIFERENCIAS
      diferenciaefectivo: Field.Currency("diferenciaefectivo", "Diferencia Caja")
        .required()
        .default(0),
      diferenciatarjeta: Field.Currency("diferenciatarjeta", "Diferencia Tarjeta")
        .required()
        .default(0),
      diferenciavale: Field.Currency("diferenciavale", "Diferencia Vales").required().default(0),
    })
    .filter(() => ["1", "eq", "1"])
    .extract(),
  pagosArqueo: Schema("tpv_arqueos", "idpago")
    .fields({
      idpago: Field.Int("idpago", "ID Pago").required(),
      fecha: Field.Date("fecha", "Fecha").required(),
      codpago: Field.Text("codpago", "Tipo Pago").required(),
      importe: Field.Currency("importe", "Importe").required(),
    })
    .filter(({ arqueos }) => ["idtpv_arqueo", "eq", arqueos.current])
    .extract(),
  puntosventa: Schema("tpv_puntosventa", "codtpv_puntoventa")
    .fields({
      puntoVenta: Field.Text("codtpv_puntoventa"),
      descripcion: Field.Text("descripcion"),
      clienteTpv: Field.Text("cliente_tpv"),

      fechaultcargacatalogo: Field.Text("fechaultcargacatalogo", "Fecha Ultima Carga"),
      printerUrl: Field.Text("urlimpresoraoffline"),
      printerAlias: Field.Text("aliasimpresoraoffline"),
      ticketReportAlias: Field.Text("reportticketimpresoraoffline"),
      codTienda: Field.Text("codtienda"),

      tiendaDireccion: Field.Text("tienda_direccion"),
      tiendaCiudad: Field.Text("tienda_ciudad"),
      tiendaTelefono: Field.Text("tienda_telefono"),
      tiendaDescripcion: Field.Text("tienda_descripcion"),
      tiendaCodpostal: Field.Text("tienda_codpostal"),
      tiendaDirtipovia: Field.Text("tienda_dirtipovia"),
      tiendaDirnum: Field.Text("tienda_dirnum"),
      tiendaDirotros: Field.Text("tienda_dirotros"),
      tiendaProvincia: Field.Text("tienda_provincia"),

      empresaNombre: Field.Text("empresa_nombre"),
      empresaCifnif: Field.Text("empresa_cifnif"),
      empresaDireccion: Field.Text("empresa_direccion"),
      empresaCiudad: Field.Text("empresa_ciudad"),
      empresaTelefono: Field.Text("empresa_telefono"),
      empresaPieTicket: Field.Text("empresa_pieticket"),
      empresaDirtipovia: Field.Text("empresa_dirtipovia"),
      empresaDirnum: Field.Text("empresa_dirnum"),
      empresaDirotros: Field.Text("empresa_dirotros"),
      empresaCodpostal: Field.Text("empresa_codpostal"),
      empresaProvincia: Field.Text("empresa_provincia"),
    })
    .extract(),
  puntosventa_config: Schema("tpv_puntosventa", "codtpv_puntoventa")
    .fields({
      puntoVenta: Field.Text("codtpv_puntoventa"),
      descripcion: Field.Text("descripcion"),
      clienteTpv: Field.Text("cliente_tpv"),
      ultimoTique: Field.Text("ultimo_tique"),

      fechaultcargacatalogo: Field.Text("fechaultcargacatalogo", "Fecha Ultima Carga"),
      printerUrl: Field.Text("urlimpresoraoffline"),
      printerAlias: Field.Text("aliasimpresoraoffline"),
      ticketReportAlias: Field.Text("reportticketimpresoraoffline"),
      codTienda: Field.Text("codtienda"),

      tiendaDireccion: Field.Text("tienda_direccion"),
      tiendaCiudad: Field.Text("tienda_ciudad"),
      tiendaTelefono: Field.Text("tienda_telefono"),
      tiendaDescripcion: Field.Text("tienda_descripcion"),
      tiendaCodpostal: Field.Text("tienda_codpostal"),
      tiendaDirtipovia: Field.Text("tienda_dirtipovia"),
      tiendaDirnum: Field.Text("tienda_dirnum"),
      tiendaDirotros: Field.Text("tienda_dirotros"),
      tiendaProvincia: Field.Text("tienda_provincia"),

      empresaNombre: Field.Text("empresa_nombre"),
      empresaCifnif: Field.Text("empresa_cifnif"),
      empresaDireccion: Field.Text("empresa_direccion"),
      empresaCiudad: Field.Text("empresa_ciudad"),
      empresaTelefono: Field.Text("empresa_telefono"),
      empresaPieTicket: Field.Text("empresa_pieticket"),
      empresaDirtipovia: Field.Text("empresa_dirtipovia"),
      empresaDirnum: Field.Text("empresa_dirnum"),
      empresaDirotros: Field.Text("empresa_dirotros"),
      empresaCodpostal: Field.Text("empresa_codpostal"),
      empresaProvincia: Field.Text("empresa_provincia"),
    })
    .extract(),
  catalogo: Schema("tpv_puntosventa", "referencia")
    .fields({
      referencia: Field.Int("referencia", "Ref. Articulo").required(),
      codbarras: Field.Date("codbarras", "Cod. Barras"),
      descripcion: Field.Text("descripcion", "Descripcion").required(),
      pvp: Field.Currency("pvp", "Precio"),
      codImpuesto: Field.Text("codimpuesto", "Cód. Impuesto"),
      iva: Field.Float("iva", "IVA"),
      recargo: Field.Float("recargo", "Recargo Eq."),
    })
    .filter(() => ["1", "eq", "1"])
    .limit(10000)
    .extract(),
  ticketEmpresa: Schema("", "")
    .fields({
      empresa_nombre: Field.Text("empresaNombre"),
      empresa_cifnif: Field.Text("empresaCifnif"),
      empresa_direccion: Field.Text("empresaDireccion"),
      empresa_ciudad: Field.Text("empresaCiudad"),
      empresa_telefono: Field.Text("empresaTelefono"),
      empresa_pieticket: Field.Text("empresaPieTicket"),
      empresa_dirtipovia: Field.Text("empresaDirtipovia"),
      empresa_dirnum: Field.Text("empresaDirnum"),
      empresa_dirotros: Field.Text("empresaDirotros"),
      empresa_codpostal: Field.Text("empresaCodpostal"),
      empresa_provincia: Field.Text("empresaProvincia"),
    })
    .extract(),
  ticketVenta: Schema("", "")
    .fields({
      idtpv_comanda: Field.Int("id"),
      tpv_comandas_codigo: Field.Text("codigo"),
      tpv_comandas_fecha: Field.Date("fecha"),
      tpv_comandas_hora: Field.Time("hora"),
      tpv_comandas_neto: Field.Currency("neto"),
      tpv_comandas_totaliva: Field.Currency("totalIva"),
      tpv_comandas_total: Field.Currency("total"),
      tpv_comandas_codtpv_agente: Field.Text("agente").load(_ => util.getUser().tpv_agente),
      nombreagente: Field.Text("nombreagente").load(_ => util.getUser().nombre_agente),
      tpv_comandas_codpuntoventa: Field.Text("puntoVenta").load(d => d.pv.codigo),
      tpv_comandas_codtienda: Field.Text("codTienda").load(d => d.pv.codTienda),
      tpv_comandas_codpago: Field.Time("hora").load(_ => "CONT"),
    })
    .extract(),
  ticketTienda: Schema("", "")
    .fields({
      tienda_direccion: Field.Text("tiendaDireccion"),
      tienda_ciudad: Field.Text("tiendaCiudad"),
      tienda_telefono: Field.Text("tiendaTelefono"),
      tienda_descripcion: Field.Text("tiendaDescripcion"),
      tienda_codpostal: Field.Text("tiendaCodpostal"),
      tienda_dirtipovia: Field.Text("tiendaDirtipovia"),
      tienda_dirnum: Field.Text("tiendaDirnum"),
      tienda_dirotros: Field.Text("tiendaDirotros"),
      tienda_provincia: Field.Text("tiendaProvincia"),
    })
    .extract(),
  ticketLineas: Schema("", "")
    .fields({
      tpv_lineascomanda_idtpv_linea: Field.Int("idLinea"),
      tpv_lineascomanda_idtpv_comanda: Field.Int("idVenta"),
      tpv_lineascomanda_referencia: Field.Text("referencia"),
      tpv_lineascomanda_descripcion: Field.Text("descripcion"),
      tpv_lineascomanda_cantidad: Field.Float("cantidad"),
      tpv_lineascomanda_pvpunitario: Field.Currency("pvpUnitario"),
      tpv_lineascomanda_pvpunitarioiva: Field.Currency("pvpUnitario"),
      tpv_lineascomanda_pvpsindto: Field.Currency("pvpSinDto"),
      tpv_lineascomanda_pvptotal: Field.Currency("pvpTotal"),
      tpv_lineascomanda_dtolineal: Field.Float("dtoLineal"),
      tpv_lineascomanda_dtopor: Field.Float("dtoPor"),
      tpv_lineascomanda_ivaincluido: Field.Text("descripcion").load(_ => "true"),
      tpv_lineascomanda_codimpuesto: Field.Text("codImpuesto"),
      tpv_lineascomanda_iva: Field.Float("iva"),
    })
    .extract(),
  ticketPagos: Schema("", "")
    .fields({
      tpv_pagoscomanda_idpago: Field.Int("idPago"),
      tpv_pagoscomanda_codpago: Field.Text("formaPago").load(p => descPagos[p.formaPago]),
      tpv_pagoscomanda_importe: Field.Currency("importe"),
    })
    .extract(),
};
