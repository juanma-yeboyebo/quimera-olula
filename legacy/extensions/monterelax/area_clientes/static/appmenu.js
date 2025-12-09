export default parent => ({
  ...parent,
  catalogo: {
    title: "Catálogo",
    items: {
      repeticiones: {
        title: "Categorías",
        icons: ["article", "restart_alt"],
        color: "primary",
        variant: "main",
        url: "/admin/catalogo/categorias",
      },
      catalogo: {
        title: "Catálogo",
        icons: ["weekend", "euro"],
        color: "primary",
        variant: "main",
        url: "/catalogo",
      },
    },
    // items: {},
  },
  areaClientes: {
    title: "Área de clientes",
    items: {
      ac_pedidoscli: {
        rule: "AreaClientes:visit",
        title: "Pedidos",
        icons: ["receipt_long", "outlined_flag"],
        color: "warning",
        variant: "main",
        url: "/areaclientes/pedidos",
      },
      ac_albaranescli: {
        rule: "AreaClientes:visit",
        title: "Mis albaranes",
        icons: ["receipt_long", "outlined_flag"],
        color: "warning",
        variant: "main",
        url: "/areaclientes/albaranes",
      },
      ac_facturascli: {
        rule: "AreaClientes:visit",
        title: "Mis facturas",
        icons: ["receipt_long", "outlined_flag"],
        color: "warning",
        variant: "main",
        url: "/areaclientes/facturas",
      },
      ac_tarifas: {
        rule: "AreaClientes:visit",
        title: "Mis tarifas",
        icons: ["local_offer", "outlined_flag"],
        color: "warning",
        variant: "main",
        url: "/areaclientes/tarifas",
      },
      ac_reparaciones: {
        rule: "AreaClientes:visit",
        title: "Reparaciones",
        icons: ["construction", "outlined_flag"],
        color: "warning",
        variant: "main",
        url: "/areaclientes/reparaciones",
      },
    },
  },
});
