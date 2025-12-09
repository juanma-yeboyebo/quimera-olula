export default parent => ({
  ...parent,
  eventos: {
    title: "Eventos",
    items: {
      eventos: {
        title: "Eventos",
        icons: ["calendar_month", "restart_alt"],
        color: "primary",
        variant: "main",
        url: "/eventos",
      },
    },
  },
});
