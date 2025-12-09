export default parent => ({
  ...parent,
  administracion: {
    title: "Establecimiento",
    items: {
      // nuevaVenta: {
      //   title: "Nueva venta",
      //   icons: ["receipt", "outlined_flag"],
      //   color: "warning",
      //   variant: "main",
      //   url: "/nuevaventa",
      // },
      ventas: {
        title: "Ventas",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        url: "/ventas",
      },
      misDatos: {
        title: "Mis datos",
        icons: ["person", "outlined_flag"],
        color: "warning",
        variant: "main",
        url: "/comercio",
      },
    },
  },
});
