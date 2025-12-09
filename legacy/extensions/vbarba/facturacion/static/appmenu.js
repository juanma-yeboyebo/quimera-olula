export default parent => ({
  ...parent,
  pedidos: {
    // items: {}
    title: "Facturación",
    items: {
      presupuestos: {
        title: "Presupuestos",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        rule: "presupuestoscli:visit",
        url: "/ventas/presupuestos",
      },
      pedidos: {
        title: "Pedidos",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        rule: "pedidoscli:visit",
        url: "/ventas/pedidos",
      },
      albaranescli: {
        title: "Albaranes de cliente",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        rule: "albaranescli:visit",
        url: "/ventas/albaranes",
      },
      facturascli: {
        title: "Facturas de cliente",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        rule: "facturascli:visit",
        url: "/ventas/facturas",
      },
    },
  },
});
