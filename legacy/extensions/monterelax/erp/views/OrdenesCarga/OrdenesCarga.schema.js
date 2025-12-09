import { Field, Schema } from "quimera/lib";

export default {
  ordenesCarga: Schema("mx_ordenescarga", "idorden")
    .fields({
      idorden: Field.Text("idorden", "Orden"),
      fecha: Field.Date("fecha", "Fecha"),
      codruta: Field.Text("codruta", "Ruta"),
      estado: Field.Text("estado", "Estado"),
      codcamion: Field.Text("codcamion", "Camion"),
      partidas: Field.Text("partidas", "Partidas")
    })
    .filter(() => ["1", "eq", "1"])
    .limit(1000)
    .order(() => ({ field: "idorden", direction: "ASC" }))
    .extract(),
  unidades_orden: Schema("mx_ordenescargadetalle", "idunidad")
    .fields({
      idunidad: Field.Text("idunidad", "UP"),
      modelo: Field.Text("modelo", "Modelo"),
      configuracion: Field.Text("configuracion", "Configuración"),
      estado: Field.Text("estado", "Estado"),
      estadoant: Field.Text("estadoant", "Estado Anterior"),
      idtelamantas: Field.Text("idtelamantas", "Tela mantas"),
      idtelacomp: Field.Text("idtelacomp", "Tela Comp"),
      idtela: Field.Text("idtela", "Tela")
    })
    .filter(() => ["1", "eq", "1"])
    .limit(1000)
    .order(() => ({ field: "idunidad", direction: "ASC" }))
    .extract(),
};
