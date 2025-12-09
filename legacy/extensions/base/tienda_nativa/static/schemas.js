import { Field, Schema, Subschema } from "quimera/lib";

export default parent => ({
  ...parent,
  categorias: Schema("to_categorias", "idcategoria")
    .fields({
      idCategoria: Field.Int("idcategoria", "ID").auto(),
      nombre: Field.Text("nombre", "Nombre"),
      idCatPadre: Field.Int("idcatpadre", "Id Categoria Padre"),
      metatags: Field.Text("metatags", "Meta Tags"),
      urlkey: Field.Text("urlkey", "URL Key"),
      habilitado: Field.Bool("habilitado", "Habilitado"),
      incluirEnMenu: Field.Bool("incluirenmenu", "Incluir en menu"),
      ordenenMenu: Field.Int("ordenenmenu", "Orden en menu"),
      metatile: Field.Text("metatile", "Meta Tile"),
      idStoreview: Field.Int("idstoreview", "Id Storeview"),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "idcategoria", direction: "ASC" })),
  login: parent.login.fields({
    admin: Field.Bool("admin", "Admin").default(false),
  }),
  catalogo: Schema("to_articulos", "referencia")
    .fields({
      referencia: Field.Text("referencia", "SKU"),
      descripcion: Field.Text("descripcion", "Descripción"),
      pvp: Field.Currency("pvp", "Precio"),
    })
    .filter(() => ["1", "eq", "1"])
    // .page(() => ({ limit: 10 }))
    .order(() => ({ field: "referencia", direction: "ASC" })),
  nuevaLineaCarrito: Schema("to_carritos", "idcarrito").fields({
    idCarrito: Field.Int("idcarrito", "Id. Carrito"),
    referencia: Field.Text("referencia", "SKU"),
    cantidad: Field.Int("cantidad", "Cantidad"),
  }),
  carrito: Schema("to_carritos", "idcarrito")
    .fields({
      idCarrito: Field.Int("idcarrito", "Id. Carrito"),
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
      idProvincia: Field.Int("idprovincia", "Id. Provincia"),
      codDir: Field.Float("coddir", "Cód. Dir."),
      cifNif: Field.Text("cifnif", "CIF/NIF").required(),
      codPago: Field.Text("codpago", "Forma de pago").default("CONT"),
      codEnvio: Field.Text("codenvio", "Forma de envío").default("NORMAL"),
      observaciones: Field.TextArea("observaciones", "Observaciones"),
      referencia: Field.Text("referencia", "Referencia"),
    })
    .subschemas({
      lineas: Subschema.List("lineas", "lineaCarrito"),
    })
    .order(() => ({ field: 'fecha', direction: 'DESC' })),
  lineaCarrito: Schema("to_lineascarrito", "idlinea").fields({
    idCarrito: Field.Int("idcarrito", "Id. Carrito"),
    idLinea: Field.Int("idlinea", "Id. Linea"),
    referencia: Field.Text("referencia", "SKU"),
    descripcion: Field.Text("descripcion", "SKU"),
    cantidad: Field.Int("cantidad", "Cantidad"),
    pvpUnitario: Field.Currency("pvpunitario", "PVP"),
    pvpTotal: Field.Currency("pvptotal", "Total"),
  }),
  // .filter(() => ['1', 'eq', '1'])
  // .order(() => ({ field: 'referencia', direction: 'ASC' })),
});
