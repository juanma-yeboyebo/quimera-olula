export default parent => ({
  ...parent,
  tpv: {
    title: "Ventas",
    items: {
      tpv: {
        title: "Punto de Venta",
        icons: ["point_of_sale"],
        url: "/tpv",
      },
    },
  },
  cajas: {
    title: "Gestión de cajas",
    items: {
      arqueos: {
        title: "Arqueos",
        icons: ["euro", "show_chart"],
        color: "warning",
        variant: "main",
        url: "/arqueos",
      },
    },
  },
});
