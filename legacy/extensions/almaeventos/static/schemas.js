import { Field, Schema } from "quimera/lib";

export default parent => ({
  ...parent,
  eventos: Schema("cl_proyectos", "codproyecto")
    .fields({
      codProyecto: Field.Text("codproyecto", "Código proyecto").dump(false),
      descripcion: Field.Text("descripcion", "Descripcion").required(),
      fechaInicio: Field.Date("finicio", "Fecha inicio").required(),
      referencia: Field.Text("referencia", "Tipo proyecto").required(),
      descripcionRef: Field.Text("descripcionref", "Descripción producto").required(),
    })
    .filter(() => ["1", "eq", "1"])
    .order(() => ({ field: "finicio", direction: "ASC" }))
    .limit(1000),
  guardaCalendario: Schema("cl_proyectos", "codproyecto").fields({
    datos: Field.Text("datos", "Datos del calendario"),
  }),
  datosCalendario: Schema("cl_proyectos", "codproyecto").fields({
    datos: Field.Text("datos", "Datos del calendario"),
    hashcode: Field.Text("hashcode", "Hashcode del calendario"),
  }),
  checkHashCalendario: Schema("public", "hash").fields({
    datos: Field.Text("datos", "Datos del calendario"),
  }),
});
