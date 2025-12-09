import { util } from "quimera";
import { Field, Schema } from "quimera/lib";

export default parent => ({
  ...parent,
  partesTrabajo: Schema("s17_partestrabajo", "codparte")
    .fields({
      codParte: Field.Text("codparte", "Código").auto(),
      fecha: Field.Date("fecha", "Fecha"),
      trabajador: Field.Text("trabajador", "Trabajador").dump(false),
      nombreTrabajador: Field.Text("nombretrabajador", "Nombre trabajador").dump(false),
      horas: Field.Float("horas", "Horas").decimals(1),
      horasparte: Field.Float("horasparte", "Horas parte").decimals(1).dump(false),
      estadoParte: Field.Text("s17_estado", "Estado"),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "fecha", direction: "DESC" }))
    .limit(15),
  lineasParte: Schema("s17_lineaspartetrabajo", "idlinea")
    .fields({
      idLinea: Field.Int("idlinea", "idLinea").auto(),
      referencia: Field.Text("referencia", "Referencia").required(),
      descripcionArticulo: Field.Text("descripcionarticulo", "Descripción Artículo").default(" "),
      descripcionCentro: Field.Text("descripcioncentro", "Descripción proyecto").default(" "),
      horas: Field.Float("horas", "Horas").required().decimals(1),
      s17horas: Field.Float("s17horas", "s17horas").required().decimals(1),
      proyecto: Field.Text("codcentro", "Proyecto").required(),
      codParte: Field.Text("codparte", "Código"),
      //familia: Field.Text("familia", "familia"),
      observaciones: Field.Text("observaciones", "Observaciones"),
    })
    .filter(({ parte }) => ["codparte", "eq", parte.data.codParte])
    .limit(10000),
  trabajos: Schema("articulos", "referencia")
    .fields({
      referencia: Field.Text("referencia", "referencia").auto(),
      descripcion: Field.Text("descripcion", "descripcion"),
    })
    .filter(() => ({
      and: [
        ["tipo", "eq", "MANO DE OBRA"],
        {
          or: [
            ["s17_oficio", "eq", util.getUser()?.oficio],
            ["s17_oficio", "eq", "Todos"],
          ],
        },
      ],
    }))
    .limit(10000),
  proyectos: Schema("s17_proyectos", "codcentro")
    .fields({
      codcentro: Field.Text("codcentro", "codcentro").auto(),
      descripcion: Field.Text("descripcion", "descripcion"),
    })
    .filter(() => ["codestado", "eq", "ABIERTO"])
    .limit(10000),
});
