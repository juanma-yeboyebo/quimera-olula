import { Field, Schema } from "quimera/lib";

export default {
  proveedor: Schema("proveedores", "codproveedor")
    .fields({
      codProveedor: Field.Text("codproveedor", "Cód. Proveedor"),
      cifNif: Field.Text("cifnif", "CIF/NIF"),
      nombre: Field.Text("nombre", "Nombre"),
    })
    .extract(),
};
