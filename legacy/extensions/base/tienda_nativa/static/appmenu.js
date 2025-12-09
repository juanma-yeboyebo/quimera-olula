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
    },
  },
});
