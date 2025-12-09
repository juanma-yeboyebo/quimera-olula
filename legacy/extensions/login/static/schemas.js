import { Field, Schema } from "quimera/lib";

export default {
  group: Schema("flgroups", "idgroup")
    .fields({
      id: Field.Text("idgroup", "Identificador").required(),
      descripcion: Field.Text("descripcion", "Descripción").required(),
    })
    .extract(),
  rule: Schema("flrules", "idregla")
    .fields({
      idRegla: Field.Text("idregla", "ID").required(),
      grupo: Field.Text("grupo", "Grupo").required(),
      descripcion: Field.Text("descripcion", "Descripción").required(),
    })
    .extract(),
  rulevalue: Schema("flpermissions", "idpermission")
    .fields({
      idPermission: Field.Text("idpermission", "ID").auto(),
      idRegla: Field.Text("idrule", "Regla").required(),
      idGroup: Field.Text("idgroup", "Grupo").required(),
      valor: Field.Bool("value", "Valor").default(null),
    })
    .extract(),
};
