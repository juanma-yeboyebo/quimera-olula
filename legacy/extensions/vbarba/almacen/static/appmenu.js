export default parent => ({
  ...parent,
  inventarios: {
    title: "Almacén",
    items: {
      // ...parent?.inventarios?.items,
      stocks: {
        title: "Stocks",
        icons: ["content_paste", "search"],
        color: "primary",
        variant: "contained",
        rule: "stocks:visit",
        url: "/stocks",
      },
      articulos: {
        title: "Artículos",
        icons: ["shopping_cart", "search"],
        color: "primary",
        variant: "contained",
        rule: "articulos:visit",
        url: "/articulos",
      },
      cambiarFinca: {
        title: "Cambiar finca",
        icons: ["swap_vert"],
        color: "primary",
        variant: "contained",
        rule: "stocks:visit",
        url: "/cambiarFinca",
      },
      partesCarros: {
        title: "Partes de carros",
        icons: ["article", "create"],
        color: "primary",
        variant: "contained",
        rule: "escarros:visit",
        url: "/partesCarros",
      },
    },
  },
});
