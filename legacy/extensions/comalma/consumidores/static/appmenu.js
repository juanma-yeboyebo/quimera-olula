export default parent => ({
  ...parent,
  administracion: {
    title: "Area Cliente",
    items: {
      compras: {
        title: "Mis compras",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        url: "/compras",
      },
      misDatos: {
        title: "Mis datos",
        icons: ["person", "outlined_flag"],
        color: "warning",
        variant: "main",
        url: "/usuario",
      },
    },
  },
});
