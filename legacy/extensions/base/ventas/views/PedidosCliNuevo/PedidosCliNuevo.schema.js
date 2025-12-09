import { Field, Schema } from "quimera/lib";
// import TypeOptions from './TypeOptions'

export default {
  pedido: Schema("pedidoscli", "idpedido")
    .fields({
      idDir: Field.Int("coddir", "Id. Dir"),
      codCliente: Field.Text("codcliente", "Cliente"),
    })
    .extract(),
};
