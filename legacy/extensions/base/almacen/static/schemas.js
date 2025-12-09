import { Field, Schema } from "quimera/lib";

export default parent => ({
  ...parent,
  articulos: Schema("articulos", "referencia")
    .fields({
      referencia: Field.Text("referencia", "Referencia"),
      descripcion: Field.Text("descripcion", "Descripción"),
    })
    .order(() => ({ field: "referencia", direction: "ASC" })),
  stocks: Schema("stocks", "idstock")
    .fields({
      referencia: Field.Text("referencia", "Referencia"),
      descripcion: Field.Text("descripcion", "Descripción"),
      disponible: Field.Bool("disponible", "Disponible"),
      precioRef: Field.Float("precioRef", "Precio referencia"),
    })
    .order(() => ({ field: "referencia", direction: "ASC" })),
  articulosprov: Schema("articulosprov", "id")
    .fields({
      referencia: Field.Text("referencia", "Referencia"),
      descripcion: Field.Text("descripcion", "Descripción"),
      precioRef: Field.Float("precioRef", "Precio referencia"),
      costeReal: Field.Float("costeReal", "Coste real"),
      descuento: Field.Float("descuento", "Descuento"),
      nombre: Field.Text("nombre", "Nombre"),
      disponible: Field.Bool("disponible", "disponible"),
    })
    .order(() => ({ field: "referencia", direction: "ASC" })),
  inventarios: Schema("inventarios", "codinventario")
    .fields({
      codInventario: Field.Text("codinventario", "Código"),
      codAlmacen: Field.Text("codalmacen", "Almacén"),
      nombreAlmacen: Field.Text("nombrealmacen", "Almacén"),
      fecha: Field.Date("fecha", "Fecha"),
    })
    .order(() => ({ field: "codinventario", direction: "DESC" })),
  lineasInventario: Schema("lineasinventario", "id")
    .fields({
      idLinea: Field.Int("id", "Id").auto(),
      codInventario: Field.Text("codinventario", "Inventario"),
      idStock: Field.Int("idstock", "Id. Stock"),
      cantidad: Field.Int("cantidadfin", "Cantidad").required(),
      referencia: Field.Float("referencia", "Artículo").required(),
      referenciaProv: Field.Float("referenciaprov", "Proveedor artículo"),
      desArticulo: Field.Float("desarticulo", "Descripción"),
      fecha: Field.Date("fecha", "Fecha"),
      hora: Field.Time("hora", "Hora"),
    })
    .order(() => ({ field: "id", direction: "DESC" })),
});
