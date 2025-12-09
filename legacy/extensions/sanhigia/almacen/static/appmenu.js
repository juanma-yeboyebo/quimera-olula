export default parent => ({
  ...parent,
  inventarios: {
    title: "Almacén",
    items: {
      inventarios: {
        title: "Inventarios",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        rule: "Inventarios:visit",
        url: "/almacen/inventarios",
      },
      prepraciones: {
        title: "Preparación de pedidos",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        rule: "sh_preparaciondepedidos:visit",
        url: "/sh_preparaciondepedidos",
      },
      pedVenta: {
        title: "Generar preparaciones",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        rule: "sh_preparaciondepedidos:visit",
        url: "/generarpreparaciones",
      },
      pedCompra: {
        title: "Pedidos de compra",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        rule: "sh_preparaciondepedidos:visit",
        url: "/pedidosdecompra",
      },
    },
  },
  // informes: {
  //   title: "Informes",
  //   items: {
  //     ...parent?.informes?.items,
  //     caducidad: {
  //       title: "Prorductos a caducar",
  //       icons: ["article", "restart_alt"],
  //       color: "primary",
  //       variant: "main",
  //       rule: "articulos:acceso_caducidad",
  //       url: "/informes/productosacaducar",
  //     },
  //   },
  // },
});
