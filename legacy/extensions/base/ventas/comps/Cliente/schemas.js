import { Field, Schema } from "quimera/lib";

export default {
  clientes: Schema("clientes", "codcliente")
    .fields({
      codCliente: Field.Text("codcliente", "Cód. Cliente"),
      cifNif: Field.Text("cifnif", "CIF/NIF"),
      nombre: Field.Text("nombre", "Nombre"),
    })
    .extract(),
};
