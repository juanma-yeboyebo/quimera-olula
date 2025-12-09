import { Field, Schema } from "quimera/lib";

export default {
  facturas: Schema("ac_facturascli", "idfactura")
    .fields({
      idFactura: Field.Int("idfactura", "idFactura").auto(),
      codigo: Field.Text("codigo", "Código"),
      fecha: Field.Date("fecha", "Fecha"),
      nombreCliente: Field.Text("nombrecliente", "Nombre Cliente"),
      total: Field.Currency("total", "Total"),
      totalIva: Field.Currency("totaliva", "Total Iva"),
      neto: Field.Currency("neto", "Neto"),
      dirTipoVia: Field.Text("dirtipovia", "Tipo Vía"),
      direccion: Field.Text("direccion", "Direccion"),
      dirNum: Field.Text("dirnum", "Núm."),
      dirOtros: Field.Text("dirotros", "Otros"),
      codPostal: Field.Text("codpostal", "Cód. Postal"),
      ciudad: Field.Text("ciudad", "Ciudad"),
      provincia: Field.Text("provincia", "Provincia"),
    })
    .filter(() => ["1", "eq", "1"])
    .extract(),
  lineasfacturas: Schema("lineasfacturascli", "idlinea")
    .fields({
      idLinea: Field.Int("idlinea", "idLinea").auto(),
      idFactura: Field.Int("idfactura", "idFactura"),
      referencia: Field.Text("referencia", "Referencia"),
      descripcion: Field.Text("descripcion", "Descripción"),
      cantidad: Field.Currency("cantidad", "Cantidad"),
      pvpUnitario: Field.Currency("pvpunitario", "PVP Unitario"),
      pvpTotal: Field.Currency("pvptotal", "Total"),
    })
    .filter(({ facturas }) => ["idfactura", "eq", facturas.current])
    .extract(),
};
