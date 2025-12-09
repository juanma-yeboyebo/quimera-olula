import { Field, Schema, Subschema } from "quimera/lib";

import { resistenciasHumedad, resistenciasSalinidad, resistenciasSol } from "./local";

export default parent => ({
  ...parent,
  lineaCarrito: parent.lineaCarrito.fields({
    urlImagen: Field.Int("urlimagen", "Imagen"),
    litraje: Field.Text("litraje", "Litraje").dump(false),
    disponible: Field.Bool("disponible", "Disponible").dump(false),
  }),
  carrito: parent.carrito.fields({
    fechaEntrega: Field.Date("vb_fechaentrega"),
    activo: Field.Bool("activo", "Activo"),
    codigo: Field.Text("codigo", "Codigo"),
    fecha: Field.Date("fecha"),
    codEnvio: Field.Text("codenvio", "Forma de envío").default("RECOGIDA"),
  }),
  referenciasPlanta: Schema("to_articulos", "referencia")
    .fields({
      referencia: Field.Text("referencia", "SKU"),
      litraje: Field.Text("litraje", "Medida"),
      forma: Field.Text("forma", "forma").default(""),
      altura: Field.Text("altura", "altura").default(""),
      perimetro: Field.Text("perimetro", "perimetro").default(""),
      pvpReferencia: Field.Currency("pvpreferencia", "Precio referencia"),
      pvp: Field.Currency("pvp", "Precio"),
      urlImagen: Field.Text("urlimage", "Imagen"),
      disponible: Field.Bool("disponible", "Disponible"),
      nombre3: Field.Text("nombre3"),
      nombre4: Field.Text("nombre4"),
      tieneFoto: Field.Bool("tienefoto").dump(false),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "referencia", direction: "ASC" })),
  catalogo: Schema("to_articulos", "codplanta")
    .fields({
      codPlanta: Field.Text("codplanta", "SKU"),
      referencia: Field.Text("referencia", "Referencia"),
      nombre: Field.Text("nombre"),
      grupoPlanta: Field.Text("grupo_planta", "Grupo planta").dump(false),
      pvp: Field.Currency("pvp", "Precio"),
      descripcion: Field.Text("descripcion", "catalogo.descripcion"),
      alturaMin: Field.Int("vb_alturamin"),
      alturaMax: Field.Int("vb_alturamax"),
      anchuraMin: Field.Int("vb_anchuramin"),
      anchuraMax: Field.Int("vb_anchuramax"),
      tempMax: Field.Int("vb_tempmax"),
      tempMin: Field.Int("vb_tempmin"),
      color: Field.Text("vb_colorfloracion"),
      disponible: Field.Bool("disponible"),
      exposicionSolar: Field.Options("vb_exposicionsolar").options(resistenciasSol),
      resHumedad: Field.Options("vb_resishumedad").options(resistenciasHumedad),
      resSalinidad: Field.Options("vb_resissalinidad").options(resistenciasSalinidad),
      descripcionPlanta: Field.Text("vb_descripcion"),
      urlImagenAlt: Field.Text("urlimagenalt").dump(false),
      tieneFoto: Field.Bool("tienefoto"),
    })
    .subschemas({
      referencias: Subschema.List("referencias", "referenciasPlanta"),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "codplanta", direction: "ASC" })),
  misLineasCarrito: parent.lineaCarrito
    .fields({
      urlImagen: Field.Int("urlimagen", "Imagen"),
      litraje: Field.Text("litraje", "Litraje").dump(false),
      disponible: Field.Bool("disponible", "Disponible").dump(false),
    })
    .filter(({ carrito }) => ["idcarrito", "eq", carrito.data.idCarrito]),
  nuevoCarrito: Schema("to_carritos", "idcarrito").fields({
    referencia: Field.Text("referencia", "Nota de cliente"),
  }),
});
