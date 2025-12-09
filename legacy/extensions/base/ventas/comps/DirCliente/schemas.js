import { Field, Schema } from "quimera/lib";

export default {
  dirClientes: Schema("dirclientes", "id")
    .fields({
      codDir: Field.Int("id", "codDir").default(null),
      codCliente: Field.Text("codcliente", "Cód. Cliente"),
      direccion: Field.Text("direccion", "Dirección").required(),
      ciudad: Field.Text("ciudad", "Población").required(),
      provincia: Field.Text("provincia", "Provincia"),
      codPais: Field.Text("codpais", "Cód. País"),
      codPostal: Field.Text("codpostal", "Cód. Postal"),
      dirTipoVia: Field.Text("dirtipovia", "T. Vía"),
      dirNum: Field.Text("dirnum", "Núm."),
      dirOtros: Field.Text("dirotros", "Otros"),
    })
    .extract(),
};
