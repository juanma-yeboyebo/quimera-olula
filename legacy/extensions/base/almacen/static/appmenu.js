export default parent => ({
  ...parent,
  inventarios: {
    title: "Almacén",
    items: {
      ...parent?.inventarios?.items,
      inventarios: {
        title: "Inventarios",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        rule: "Inventarios:visit",
        url: "/almacen/inventarios",
      },
    },
  },
});
