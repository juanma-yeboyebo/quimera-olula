export default parent => ({
  ...parent,
  pedidos: {
    title: "Pedidos",
    items: {
      // ...parent?.pedidos?.items,
      presupuestos: {
        title: "Presupuestos",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        url: "/ventas/presupuestos",
      },
      pedidos: {
        title: "Pedidos",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        url: "/ventas/pedidos",
        rule: "PedidosCli:visit",
      },
    },
  },
});
