export default parent => ({
  ...parent,
  direccionAnalisis: {
    title: "Análisis",
    items: {
      in_dataframe: {
        title: "Ventas",
        icons: ["receipt", "outlined_flag"],
        color: "warning",
        variant: "main",
        url: "/analisis/ventas",
      },
    },
  },
});
