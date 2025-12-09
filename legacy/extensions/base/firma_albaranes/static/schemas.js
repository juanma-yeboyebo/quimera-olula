import { Field, Schema } from "quimera/lib";

export default parent => ({
  ...parent,
  albaranescli: parent.albaranescli.fields({
    firmado: Field.Bool("firmado", "firmado"),
    firmadoPor: Field.Text("firmadopor", "Firmado por"),
  }),
  contacto: Schema("contactos", "codcliente").fields({
    nombre: Field.Text("nombre", "nombre"),
    nif: Field.Text("nif", "nif"),
  }),
});
