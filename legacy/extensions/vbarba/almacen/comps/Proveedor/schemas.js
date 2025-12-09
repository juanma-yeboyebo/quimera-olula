import { Field, Schema } from "quimera/lib";

export default {
  proveedores: Schema("proveedores", "codproveedor,")
    .fields({
      codProveedor: Field.Text("codproveedor,", "Cód. proveedor,"),
      aliasprov: Field.Text("aliasprov", "alias proveedor"),
      nombre: Field.Text("nombre", "Nombre"),
    })
    .extract(),
};
