export default parent => ({
  ...parent,
  areaClientes: {
    title: "Área de clientes",
    items: {
      ac_pedidoscli: {
        rule: "AreaClientes:visit",
        title: "Mis pedidos",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        url: "/areaclientes/pedidos",
      },
      ac_albaranescli: {
        rule: "AreaClientes:visit",
        title: "Mis albaranes",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        url: "/areaclientes/albaranes",
      },
      ac_facturascli: {
        rule: "AreaClientes:visit",
        title: "Mis facturas",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        url: "/areaclientes/facturas",
      },
    },
  },
});
