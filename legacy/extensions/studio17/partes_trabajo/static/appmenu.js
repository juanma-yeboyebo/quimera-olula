export default parent => ({
  ...parent,
  partes: {
    title: "Partes de trabajo",
    items: {
      partes: {
        title: "Partes de trabajo",
        icons: ["receipt", "rotate_left"],
        color: "warning",
        variant: "main",
        url: "/partes-trabajo",
      },
    },
  },
});
