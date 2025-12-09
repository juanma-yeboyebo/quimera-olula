

import { Field, Schema } from "quimera/lib";

export default {
  colaMontado: Schema("mx_colasillones", "idunidad")
    .fields({
      idunidad: Field.Text("idunidad", "Id. Unidad"),
      modelo: Field.Text("modelo", "Modelo"),
      configuracion: Field.Text("configuracion", "Configuración"),
      idtela: Field.Text("idtela", "Id. Tela"),
      fechaprevista: Field.Date("fechaprevista", "Fecha prevista")
    })
    .filter(() => ["1", "eq", "1"])
    .limit(1000)
    .order(() => ({ field: "fechaprevista", direction: "ASC" }))
    .extract(),
};
