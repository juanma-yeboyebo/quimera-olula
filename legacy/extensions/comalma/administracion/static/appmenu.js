export default parent => ({
  ...parent,
  administracion: {
    title: "Administración",
    items: {
      comercios: {
        title: "Establecimientos",
        icons: ["store", ""],
        color: "warning",
        variant: "main",
        url: "/establecimientos",
      },
      campanas: {
        title: "Campañas",
        icons: ["campaign", ""],
        color: "warning",
        variant: "main",
        url: "/campanas",
      },
    },
  },
  consultas: {
    title: "Consultas",
    items: {
      usuarios: {
        title: "Usuarios",
        icons: ["person", "search"],
        color: "primary",
        variant: "main",
        url: "/consultas/usuarios",
      },
      // compras: {
      //   title: "Compras",
      //   icons: ["shopping_basket", "list"],
      //   color: "primary",
      //   variant: "main",
      //   url: "/consultas/compras",
      // },
      comprasUsuarios: {
        title: "Compras por usuario",
        icons: ["person", "shopping_basket"],
        color: "primary",
        variant: "main",
        url: "/consultas/comprasporusuario",
      },
      comprasEstablecimiento: {
        title: "Ventas por establecimiento",
        icons: ["store", "shopping_basket"],
        color: "primary",
        variant: "main",
        url: "/consultas/ventasporestablecimiento",
      },
      comprasCodigoPostal: {
        title: "Compras por código postal",
        icons: ["location_city", "shopping_basket"],
        color: "primary",
        variant: "main",
        url: "/consultas/compraporcp",
      },
    },
  },
});
