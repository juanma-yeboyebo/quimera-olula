import { Field, Schema } from "quimera/lib";

export default {
  stocks: Schema("mx_gestionstocksofas", "id")
    .fields({
      id: Field.Int("id", "Id"),
      canstock: Field.Int("canstock", "Cant. Stock"),
      modelo: Field.Text("modelo", "Modelo"),
      configuracion: Field.Text("configuracion", "Configuracion"),
      reftela: Field.Text("reftela", "Ref. tela"),
      tela: Field.Text("tela", "Desc. tela"),
      telamanta: Field.Text("telamanta", "Desc. tela manta"),
      telacomp: Field.Text("telacomp", "Desc. tela comp"),
      cancosidas: Field.Int("cancosidas", "Cant. Cosido"),
      canterminadas: Field.Int("canterminadas", "Cant. Terminado"),
    })
    .filter(() => ["1", "eq", "1"])
    .limit(1000)
    .extract(),
  pedidoscli: Schema("mx_gestionstocksofas", "id")
    .fields({
      idDir: Field.Int("coddir", "Id. Dir"),
      codCliente: Field.Text("codcliente", "Cliente"),
      referencia: Field.Text("referencia", "Referencia"),
      lineas: Field.Text("lineas", "Líneas").dump(data => data.lineas),
    })
    .extract(),
};
