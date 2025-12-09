export default {
  // pedidos:
  //   Schema('pedidoscli', 'idpedido')
  //     .fields({
  //       idPedido: Field.Int('idpedido', 'idPedido').auto(),
  //       codigo: Field.Text('codigo', 'Código'),
  //       fecha: Field.Date('fecha', 'Fecha'),
  //       nombreCliente: Field.Text('nombrecliente', 'Nombre Cliente'),
  //       codCliente: Field.Text('codcliente', 'Código de Cliente'),
  //       total: Field.Currency('total', 'Total'),
  //       totalIva: Field.Currency('totaliva', 'Total Iva'),
  //       neto: Field.Currency('neto', 'Neto'),
  //       dirTipoVia: Field.Text('dirtipovia', 'Tipo Vía'),
  //       direccion: Field.Text('direccion', 'Direccion'),
  //       dirNum: Field.Text('dirnum', 'Núm.'),
  //       dirOtros: Field.Text('dirotros', 'Otros'),
  //       codPostal: Field.Text('codpostal', 'Cód. Postal'),
  //       ciudad: Field.Text('ciudad', 'Ciudad'),
  //       provincia: Field.Text('provincia', 'Provincia'),
  //       codDir: Field.Float('coddir', 'Cód. Dir.'),
  //       codAgente: Field.Text('codagente', 'Agente'),
  //       cifNif: Field.Text('cifnif', 'CIF/NIF')
  //     })
  //     .filter(() => ['1', 'eq', '1'])
  //     .extract(),
  // lineaspedidos:
  //   Schema('lineaspedidoscli', 'idlinea')
  //   .fields({
  //     idLinea: Field.Int('idlinea', 'idLinea').auto(),
  //     idPedido: Field.Int('idpedido', 'idPedido'),
  //     referencia: Field.Text('referencia', 'Referencia'),
  //     descripcion: Field.Text('descripcion', 'Descripción'),
  //     cantidad: Field.Currency('cantidad', 'Cantidad'),
  //     pvpUnitario: Field.Currency('pvpunitario', 'PVP Unitario'),
  //     pvpTotal: Field.Currency('pvptotal', 'Total')
  //   })
  //   .filter(({ pedidos }) => ['idpedido', 'eq', pedidos.current])
  //   .extract()
};
