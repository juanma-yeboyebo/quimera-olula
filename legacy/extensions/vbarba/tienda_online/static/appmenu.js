export default parent => ({
  ...parent,
  catalogo: {
    title: "Catálogo",
    items: {
      tienda: {
        title: "Tienda2",
        icons: ["shopping_cart", null],
        color: "primary",
        variant: "main",
        url: "/catalogo",
      },
    },
  },
  areaClientes: {
    title: "Área de clientes",
    items: {

      carritos: {
        title: "Carritos",
        icons: ["shopping_cart", ""],
        color: "warning",
        variant: "main",
        url: "/carritos",
      },
      misPedidos: {
        title: "Mis pedidos web",
        icons: ["shopping_cart", ""],
        color: "warning",
        variant: "main",
        url: "/mispedidosweb",
      },
      ...parent?.areaClientes?.items,
      condicionesVenta: {
        title: "Condiciones de venta",
        icons: ["handshake", ""],
        color: "warning",
        variant: "main",
        url: "/carritos",
        type: "appDispatch",
        appDispatch: {
          type: "setModalVisible",
          payload: { name: "CondicionesVenta" },
        },
      },
    },
  },
});
